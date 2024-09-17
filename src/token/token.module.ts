import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokensService } from './token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Token])],

  controllers: [TokenController],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokenModule { }
