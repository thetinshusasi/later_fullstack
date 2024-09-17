import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { URL } from 'url';
import { Link } from './entities/link.entity';
import { CreateLinkDto } from './dtos/create-link.dto';
import { isValidUrl } from '../utils/urlHelper';
import { User } from '../users/entities/user.entity';
import { Logger } from 'nestjs-pino';

@Injectable()
export class LinksService {
    constructor(
        @InjectRepository(Link)
        private linksRepository: Repository<Link>,
        private readonly logger: Logger,
    ) { }

    async create(createLinkDto: CreateLinkDto, userId: number): Promise<Link> {
        try {
            let { url, params } = createLinkDto;
            this.logger.debug(`Creating a new link for user ID ${userId} with URL: ${url}`);

            if (!isValidUrl(url)) {
                this.logger.warn(`Invalid URL provided: ${url}`);
                throw new BadRequestException('Invalid URL');
            }

            const linkData = await this.linksRepository.findOne({
                where: { originalUrl: url, user: { id: userId } },
            });

            let newUrl = new URL(url);
            if (linkData) {
                const oldParams = linkData.parameters;
                params = { ...oldParams, ...params };
            }

            const searchParams = new URLSearchParams();
            for (const [key, value] of Object.entries(params)) {
                searchParams.set(key, value);
            }
            newUrl.search = searchParams.toString();
            const newUrlString = newUrl.toString();

            if (!isValidUrl(newUrlString)) {
                this.logger.warn(`Generated invalid new URL: ${newUrlString}`);
                throw new BadRequestException('Invalid URL');
            }

            const linkObj: Link = {
                id: linkData ? linkData.id : null,
                originalUrl: url,
                parameters: params,
                newUrl: newUrlString,
                user: { id: userId } as User,
            };
            const savedLink = await this.linksRepository.save(linkObj);
            this.logger.debug(`Link saved with ID: ${savedLink.id}`);
            return savedLink;
        } catch (error) {
            if (error instanceof BadRequestException) {
                this.logger.warn(error.message);
                throw error;
            } else {
                this.logger.error('Error creating link', error);
                throw new InternalServerErrorException('Error creating link');
            }
        }
    }

    async findAll(skip: number, take: number): Promise<Link[]> {
        try {
            this.logger.debug(`Fetching links with skip: ${skip}, take: ${take}`);
            const links = await this.linksRepository.find({
                skip,
                take,
                order: { id: 'DESC' },
            });
            return links;
        } catch (error) {
            this.logger.error('Error fetching links', error);
            throw new InternalServerErrorException('Error fetching links');
        }
    }
}
