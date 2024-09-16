import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';

import { LinkInBioModule } from './link-in-bio/link-in-bio.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({


  imports: [
    LoggerModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +process.env.DB_PORT || 5433,
      username: process.env.DB_USERNAME || 'nest_user',
      password: process.env.DB_PASSWORD || 'nest_password',
      database: process.env.DB_NAME || 'nest_db',
      autoLoadEntities: true,
      synchronize: true, // Disable in production
    }),
    UsersModule,
    LinkInBioModule,
    AuthModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
