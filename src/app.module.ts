import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LinksModule } from './links/links.module';
import { ConfigModule } from '@nestjs/config';
import { TokenModule } from './token/token.module';
import { DatabaseType } from './common/models/types/databases';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
      }
    }),
    TypeOrmModule.forRoot({
      type: String(process.env.DATABASE_TYPE) as DatabaseType,
      host: process.env.DB_HOST || 'localhost',
      port: +process.env.DB_PORT || 5433,
      username: process.env.DB_USERNAME || 'nest_user',
      password: process.env.DB_PASSWORD || 'nest_password',
      database: process.env.DB_NAME || 'nest_db',
      autoLoadEntities: true,
      synchronize: Boolean(process.env.SYNCHRONIZE) || false
    }),
    UsersModule,
    AuthModule,
    LinksModule,
    TokenModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
