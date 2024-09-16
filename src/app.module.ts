import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';

import { UserModule } from './user/user.module';
import { LinkInBioModule } from './link-in-bio/link-in-bio.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';


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
    UserModule,
    LinkInBioModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
