import { IRequestContext } from './../auth/models/request-context';
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    UnauthorizedException,
    UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { User } from './entities/user.entity';
import { UserRole } from './entities/enums/user-role.enum';
import { IUser } from './entities/model/user';
import { CreateUserDto } from './dtos/create-user.dto';
import { ContextExtractInterceptor } from 'src/interceptors/context-extract/context-extract.interceptor';

@Controller('users')
@UseInterceptors(ContextExtractInterceptor)

export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        const dateVal = new Date().getTime()

        const user = new User();
        user.username = createUserDto.username;
        user.password = createUserDto.password;
        user.role = UserRole.CUSTOMER;
        user.createdAt = dateVal;
        user.lastUpdatedAt = dateVal;

        return this.usersService.create(user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get()
    async findAll(@Request() req) {
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        const context: IRequestContext = req.context;
        return this.usersService.findOne(context.userId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.usersService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch(':id')
    async update(
        @Param('id') id: number,
        @Body() updateUserDto: Partial<User>,
        @Request() req,
    ) {
        const userId = parseInt(id.toString(), 10);
        if (req.user.userId !== userId && req.user.role !== UserRole.ADMIN) {
            throw new UnauthorizedException();
        }
        return this.usersService.update(userId, updateUserDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    async remove(@Param('id') id: number) {
        return this.usersService.remove(id);
    }
}
