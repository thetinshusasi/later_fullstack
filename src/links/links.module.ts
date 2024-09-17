import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContextExtractInterceptor } from '../interceptors/context-extract/context-extract.interceptor';
import { TokenModule } from '../token/token.module';
import { Link } from './entities/link.entity';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Link]),
    CacheModule.register(),
    TokenModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    })
  ],
  providers: [LinksService, ContextExtractInterceptor],
  controllers: [LinksController]
})
export class LinksModule { }
