import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Logger } from 'nestjs-pino';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private readonly logger: Logger,
    ) { }

    async findByUsername(username: string): Promise<User | undefined> {
        try {
            this.logger.debug(`Finding user by username: ${username}`);
            return await this.usersRepository.findOne({ where: { username } });
        } catch (error) {
            this.logger.error(`Error finding user by username: ${username}`, error);
            throw new InternalServerErrorException('Error finding user by username');
        }
    }

    async create(user: User): Promise<User> {
        try {
            this.logger.debug(`Creating a new user with username: ${user.username}`);
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(user.password, salt);
            const newUser = await this.usersRepository.save(user);
            this.logger.debug(`User created with ID: ${newUser.id}`);
            return newUser;
        } catch (error) {
            this.logger.error('Error creating user', error);
            throw new InternalServerErrorException('Error creating user');
        }
    }

    async findAll(): Promise<User[]> {
        try {
            this.logger.debug('Fetching all users');
            return await this.usersRepository.find();
        } catch (error) {
            this.logger.error('Error fetching users', error);
            throw new InternalServerErrorException('Error fetching users');
        }
    }

    async findOne(id: number): Promise<User> {
        try {
            this.logger.debug(`Fetching user with ID: ${id}`);
            const user = await this.usersRepository.findOne({ where: { id } });
            if (!user) {
                this.logger.warn(`User with ID ${id} not found`);
                throw new NotFoundException(`User with ID ${id} not found`);
            }
            return user;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Error fetching user with ID: ${id}`, error);
            throw new InternalServerErrorException('Error fetching user');
        }
    }

    async update(id: number, user: Partial<User>): Promise<any> {
        try {
            this.logger.debug(`Updating user with ID: ${id}`);
            if (user.password) {
                const salt = await bcrypt.genSalt();
                user.password = await bcrypt.hash(user.password, salt);
            }
            const result = await this.usersRepository.update(id, user);
            if (result.affected === 0) {
                this.logger.warn(`User with ID ${id} not found for update`);
                throw new NotFoundException(`User with ID ${id} not found`);
            }
            this.logger.debug(`User with ID ${id} updated`);
            return result;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Error updating user with ID: ${id}`, error);
            throw new InternalServerErrorException('Error updating user');
        }
    }

    async remove(id: number): Promise<void> {
        try {
            this.logger.debug(`Deleting user with ID: ${id}`);
            const result = await this.usersRepository.delete(id);
            if (result.affected === 0) {
                this.logger.warn(`User with ID ${id} not found for deletion`);
                throw new NotFoundException(`User with ID ${id} not found`);
            }
            this.logger.debug(`User with ID ${id} deleted`);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Error deleting user with ID: ${id}`, error);
            throw new InternalServerErrorException('Error deleting user');
        }
    }
}
