import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContextExtractInterceptor } from 'src/interceptors/context-extract/context-extract.interceptor';
import { TokenModule } from 'src/token/token.module';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';


@Module({
  imports: [TypeOrmModule.forFeature([User]),
    TokenModule,
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
  })
  ],
  providers: [UsersService, ContextExtractInterceptor],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule { }
