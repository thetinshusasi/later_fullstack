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
    NotFoundException,
    InternalServerErrorException,
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
import { Logger } from 'nestjs-pino';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
@UseInterceptors(ContextExtractInterceptor)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly logger: Logger, // Inject Logger
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully', type: User })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiBody({ type: CreateUserDto })
    async create(@Body() createUserDto: CreateUserDto) {
        try {
            this.logger.debug('Creating a new user');
            const dateVal = new Date().getTime();

            const user = new User();
            user.username = createUserDto.username;
            user.password = createUserDto.password;
            user.role = createUserDto.role || UserRole.CUSTOMER;
            user.createdAt = dateVal;
            user.lastUpdatedAt = dateVal;

            const newUser = await this.usersService.create(user);
            this.logger.debug(`User created with ID: ${newUser.id}`);
            return newUser;
        } catch (error) {
            this.logger.error('Error creating user', error);
            throw new InternalServerErrorException('Error creating user');
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Users retrieved successfully', type: [User] })
    async findAll() {
        try {
            this.logger.debug('Fetching all users');
            const users = await this.usersService.findAll();
            return users;
        } catch (error) {
            this.logger.error('Error fetching users', error);
            throw new InternalServerErrorException('Error fetching users');
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'Profile retrieved successfully', type: User })
    async getProfile(@Request() req) {
        try {
            const context: IRequestContext = req.context;
            this.logger.debug(`Fetching profile for user ID: ${context.userId}`);
            const user = await this.usersService.findOne(context.userId);
            return user;
        } catch (error) {
            this.logger.error('Error fetching profile', error);
            throw new InternalServerErrorException('Error fetching profile');
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get(':id')
    @ApiOperation({ summary: 'Get a user by ID' })
    @ApiResponse({ status: 200, description: 'User retrieved successfully', type: User })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiParam({ name: 'id', description: 'User ID', type: Number })
    async findOne(@Param('id') id: number) {
        try {
            this.logger.debug(`Fetching user with ID: ${id}`);
            const user = await this.usersService.findOne(id);
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
        try {
            const userId = parseInt(id.toString(), 10);
            this.logger.debug(`Updating user with ID: ${userId}`);
            if (req.user.userId !== userId && req.user.role !== UserRole.ADMIN) {
                this.logger.warn('Unauthorized attempt to update user');
                throw new UnauthorizedException();
            }
            const result = await this.usersService.update(userId, updateUserDto);
            this.logger.debug(`User with ID ${userId} updated`);
            return result;
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            this.logger.error(`Error updating user with ID: ${id}`, error);
            throw new InternalServerErrorException('Error updating user');
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a user by ID' })
    @ApiResponse({ status: 200, description: 'User deleted successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiParam({ name: 'id', description: 'User ID', type: Number })
    async remove(@Param('id') id: number) {
        try {
            const userId = parseInt(id.toString(), 10);
            this.logger.debug(`Deleting user with ID: ${userId}`);
            await this.usersService.remove(userId);
            this.logger.debug(`User with ID ${userId} deleted`);
            return { message: 'User deleted successfully' };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Error deleting user with ID: ${id}`, error);
            throw new InternalServerErrorException('Error deleting user');
        }
    }
}
