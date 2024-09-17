import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';

import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

import { JwtAuthGuard } from './jwt-auth.guard';
import { Token } from '../token/entities/token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesGuard } from './roles.guard';
import { UsersModule } from 'src/users/users.module';
import { TokenModule } from 'src/token/token.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token]),
    PassportModule,
    UsersModule,
    TokenModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    })
  ],
  providers: [AuthService, JwtAuthGuard, RolesGuard, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule { }
