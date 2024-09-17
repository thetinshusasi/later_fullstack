import {
    Controller,
    Post,
    Body,
    UseGuards,
    Request,
    Get,
    Query,
    UseInterceptors,
    InternalServerErrorException,
    BadRequestException,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateLinkDto } from './dtos/create-link.dto';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Link } from './entities/link.entity';
import { ContextExtractInterceptor } from '../interceptors/context-extract/context-extract.interceptor';
import { IRequestContext } from '../auth/models/request-context';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiQuery,
} from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

@ApiTags('links')
@ApiBearerAuth('access-token')
@Controller()
@UseInterceptors(ContextExtractInterceptor)
export class LinksController {
    constructor(
        private readonly linksService: LinksService,
        private readonly logger: Logger,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('append-parameters')
    @ApiOperation({ summary: 'Append parameters to a URL' })
    @ApiResponse({
        status: 201,
        description: 'Parameters appended successfully',
        schema: {
            example: {
                originalUrl: 'https://example.com',
                parameters: { utm_source: 'newsletter' },
                newUrl: 'https://example.com?utm_source=newsletter',
            },
        },
    })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiBody({ type: CreateLinkDto })
    async appendParameters(@Body() createLinkDto: CreateLinkDto, @Request() req) {
        try {
            const context: IRequestContext = req.context;
            this.logger.debug(
                `User ID ${context.userId} is appending parameters to URL: ${createLinkDto.url}`,
            );
            const link = await this.linksService.create(createLinkDto, context.userId);
            this.logger.debug(`New link created with ID: ${link.id}`);
            return {
                originalUrl: link.originalUrl,
                parameters: link.parameters,
                newUrl: link.newUrl,
            };
        } catch (error) {
            if (error instanceof BadRequestException) {
                this.logger.warn(`Bad request: ${error.message}`);
                throw error;
            } else {
                this.logger.error('Error in appendParameters', error);
                throw new InternalServerErrorException('Error appending parameters to URL');
            }
        }
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(CacheInterceptor)
    @CacheKey('links')
    @CacheTTL(30)
    @Get('links')
    @ApiOperation({ summary: 'Get all links' })
    @ApiResponse({
        status: 200,
        description: 'Links retrieved successfully',
        type: [Link],
    })
    @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
    @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 10 })
    async getLinks(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
    ): Promise<Link[]> {
        try {
            const skip = (page - 1) * limit;
            this.logger.debug(`Fetching links with skip: ${skip}, take: ${limit}`);
            const links = await this.linksService.findAll(skip, limit);
            return links;
        } catch (error) {
            this.logger.error('Error fetching links', error);
            throw new InternalServerErrorException('Error fetching links');
        }
    }
}
