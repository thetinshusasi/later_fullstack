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
import { UserRole } from './models/enums/user-role.enum';
import { CreateUserDto } from './dtos/create-user.dto';
import { ContextExtractInterceptor } from 'src/interceptors/context-extract/context-extract.interceptor';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { IRequestContext } from 'src/auth/models/request-context';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
@UseInterceptors(ContextExtractInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully', type: User })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiBody({ type: CreateUserDto })
    async create(@Body() createUserDto: CreateUserDto) {
        const dateVal = new Date().getTime();

        const user = new User();
        user.username = createUserDto.username;
        user.password = createUserDto.password;
        user.role = createUserDto.role || UserRole.CUSTOMER;
        user.createdAt = dateVal;
        user.lastUpdatedAt = dateVal;

        return this.usersService.create(user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Users retrieved successfully', type: [User] })
    async findAll() {
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'Profile retrieved successfully', type: User })
    async getProfile(@Request() req) {
        const context: IRequestContext = req.context;
        return this.usersService.findOne(context.userId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get(':id')
    @ApiOperation({ summary: 'Get a user by ID' })
    @ApiResponse({ status: 200, description: 'User retrieved successfully', type: User })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiParam({ name: 'id', description: 'User ID', type: Number })
    async findOne(@Param('id') id: number) {
        return this.usersService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch(':id')
    @ApiOperation({ summary: 'Update a user by ID' })
    @ApiResponse({ status: 200, description: 'User updated successfully', type: User })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiParam({ name: 'id', description: 'User ID', type: Number })
    @ApiBody({ description: 'Partial user data', type: CreateUserDto })
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
    @ApiOperation({ summary: 'Delete a user by ID' })
    @ApiResponse({ status: 200, description: 'User deleted successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiParam({ name: 'id', description: 'User ID', type: Number })
    async remove(@Param('id') id: number) {
        return this.usersService.remove(id);
    }
}
