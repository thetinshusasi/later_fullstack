// users/users.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { User } from './entities/user.entity';
import { UserRole } from './entities/enums/user-role.enum';
import { IUser } from './entities/model/user';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // Public endpoint to create a new user
    @Post()
    async create(@Body() user: IUser) {
        const dateVal = new Date().getTime()
        const userData: User = {
            ...user,
            id: null,
            role: UserRole.CUSTOMER, // Default role, adjust as needed
            createdAt: dateVal,
            lastUpdatedAt: dateVal,
        }
        return this.usersService.create(userData);
    }

    // Protected endpoint to get all users (admin only)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    // Protected endpoint to get a user by ID
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.usersService.findOne(id);
    }

    // Protected endpoint to update a user
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(@Param('id') id: number, @Body() user: Partial<User>) {
        return this.usersService.update(id, user);
    }

    // Protected endpoint to delete a user (admin only)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    async remove(@Param('id') id: number) {
        return this.usersService.remove(id);
    }
}
