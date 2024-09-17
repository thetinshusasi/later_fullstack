import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findByUsername(username: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { username } });
    }

    async create(user: User): Promise<User> {
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);
        return this.usersRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findOne(id: number): Promise<User> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async update(id: number, user: Partial<User>): Promise<any> {
        if (user.password) {
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(user.password, salt);
        }
        return this.usersRepository.update(id, user);
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
