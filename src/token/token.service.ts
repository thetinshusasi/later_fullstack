import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';

@Injectable()
export class TokensService {
    constructor(
        @InjectRepository(Token)
        private tokensRepository: Repository<Token>,
    ) { }

    async create(token: Token): Promise<Token> {
        return this.tokensRepository.save(token);
    }

    async findByUserIdAndToken(userId: number, token: string): Promise<Token> {
        const tokens = await this.tokensRepository.find({
            where: { user: { id: userId }, token }
        });

        return tokens.length !== 0 ? tokens[0] : null;
    }

    async delete(id: number): Promise<void> {
        await this.tokensRepository.delete(id);
    }
}
