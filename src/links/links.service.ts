// src/links/links.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { URL } from 'url';
import { Link } from './entities/link.entity';
import { CreateLinkDto } from './dtos/create-link.dto';
import { isValid } from 'date-fns';
import { isValidUrl } from 'src/utils/urlHelper';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LinksService {
    constructor(
        @InjectRepository(Link)
        private linksRepository: Repository<Link>,
    ) { }

    async create(createLinkDto: CreateLinkDto, userId: number): Promise<Link> {
        let { url, params } = createLinkDto;

        if (!isValidUrl(url)) {
            throw new BadRequestException('Invalid URL');
        }

        const linkData = await this.linksRepository.findOne({
            where: { originalUrl: url, user: { id: userId } },
        });

        let newUrl = new URL(url);
        if (linkData) {
            // Merge old parameters with new ones. If a key exists in both, the new value is used.
            const oldParams = linkData.parameters;
            params = { ...oldParams, ...params };
        }

        // Use URLSearchParams to handle the parameters correctly
        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            searchParams.set(key, value);
        }
        newUrl.search = searchParams.toString();
        const newUrlString = newUrl.toString();

        if (!isValidUrl(newUrlString)) {
            throw new BadRequestException('Invalid URL');
        }

        const linkObj: Link = {
            id: linkData ? linkData.id : null,
            originalUrl: url,
            parameters: params,
            newUrl: newUrlString,
            user: { id: userId } as User
        };
        return this.linksRepository.save(linkObj);
    }

    async findAll(skip: number, take: number): Promise<Link[]> {
        return this.linksRepository.find({
            skip,
            take,
            order: { id: 'DESC' },
        });
    }

}
