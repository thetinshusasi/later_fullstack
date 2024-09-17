import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { Link } from './entities/link.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TokenModule } from 'src/token/token.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ContextExtractInterceptor } from 'src/interceptors/context-extract/context-extract.interceptor';

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
