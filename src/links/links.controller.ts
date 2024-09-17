import {
    Controller,
    Post,
    Body,
    UseGuards,
    Request,
    Get,
    Query,
    UseInterceptors,

} from '@nestjs/common';
import { LinksService } from './links.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateLinkDto } from './dtos/create-link.dto';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Link } from './entities/link.entity';
import { ContextExtractInterceptor } from 'src/interceptors/context-extract/context-extract.interceptor';
import { IRequestContext } from 'src/auth/models/request-context';

@Controller()
@UseInterceptors(ContextExtractInterceptor)

export class LinksController {
    constructor(private linksService: LinksService) { }

    @UseGuards(JwtAuthGuard)
    @Post('append-parameters')
    async appendParameters(@Body() createLinkDto: CreateLinkDto, @Request() req) {
        try {
            const context: IRequestContext = req.context
            const link = await this.linksService.create(createLinkDto, context.userId);
            return {
                originalUrl: link.originalUrl,
                parameters: link.parameters,
                newUrl: link.newUrl,
            };
        } catch (error) {
            return { error: error.message };
        }
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(CacheInterceptor)
    @CacheKey('links')
    @CacheTTL(30)
    @Get('links')
    async getLinks(@Query('page') page = 1, @Query('limit') limit = 10): Promise<Link[]> {
        const skip = (page - 1) * limit;
        return this.linksService.findAll(skip, limit);
    }
}
