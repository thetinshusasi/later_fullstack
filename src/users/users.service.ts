// users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'; // For password hashing
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    // Find user by username
    async findByUsername(username: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { username } });
    }

    // Create a new user
    async create(user: User): Promise<User> {
        // Hash the password before saving
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);
        return this.usersRepository.save(user);
    }

    // Retrieve all users
    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    // Retrieve a user by ID
    async findOne(id: number): Promise<User> {
        return this.usersRepository.findOne({ where: { id } });
    }

    // Update a user's data
    async update(id: number, user: Partial<User>): Promise<any> {
        if (user.password) {
            // Hash the new password
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(user.password, salt);
        }
        return this.usersRepository.update(id, user);
    }

    // Delete a user
    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
