import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { LinkInBioModule } from './link-in-bio/link-in-bio.module';


@Module({


  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +process.env.DB_PORT || 5432,
      username: process.env.DB_USERNAME || 'nest_user',
      password: process.env.DB_PASSWORD || 'nest_password',
      database: process.env.DB_NAME || 'nest_db',
      autoLoadEntities: true,
      synchronize: true, // Disable in production
    }),
    UserModule,
    LinkInBioModule]
})
export class AppModule { }
