
import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthModule } from 'src/auth/auth.module';
import { TokenModule } from 'src/token/token.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ContextExtractInterceptor } from 'src/interceptors/context-extract/context-extract.interceptor';
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
