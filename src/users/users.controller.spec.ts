import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { UserRole } from './models/enums/user-role.enum';
import { NotFoundException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { TokensService } from '../token/token.service';
import { ContextExtractInterceptor } from '../interceptors/context-extract/context-extract.interceptor';

describe('UsersController', () => {
  let controller: UsersController;
  let interceptor: ContextExtractInterceptor;

  const mockJwtAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };
  const mockJwtService = {
    verify: jest.fn().mockImplementation((token: string) => {
      // Return a mock decoded token or throw an error for invalid tokens
      if (token === 'validToken') {
        return { userId: 1, role: 'ADMIN' }; // Mocked decoded token
      } else {
        throw new Error('Invalid token');
      }
    }),
  };

  const mockTokensService = {
    findToken: jest.fn(),
    saveToken: jest.fn(),
  };


  let service: jest.Mocked<UsersService>;
  let logger: jest.Mocked<Logger>;

  beforeEach(async () => {
    // Mock the UsersService
    const mockUsersService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findByUsername: jest.fn(),
    };

    // Mock the Logger
    const mockLogger = {
      debug: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      log: jest.fn(),
      verbose: jest.fn(),
      setContext: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        ContextExtractInterceptor,
        { provide: UsersService, useValue: mockUsersService },
        { provide: Logger, useValue: mockLogger },
        { provide: JwtService, useValue: mockJwtService }, // Add this line

      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideProvider(JwtService)
      .useValue(mockJwtService)
      .overrideProvider(TokensService)
      .useValue(mockTokensService)
      .compile();

    interceptor = module.get<ContextExtractInterceptor>(ContextExtractInterceptor);
    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService) as jest.Mocked<UsersService>;
    logger = module.get(Logger) as jest.Mocked<Logger>;
  }); afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserDto: CreateUserDto = { username: 'testuser', password: 'password123', role: UserRole.ADMIN };
      const dateVal = new Date().getTime();
      const newUser: User = new User();
      newUser.id = 1;
      newUser.username = createUserDto.username;
      newUser.password = createUserDto.password;
      newUser.role = createUserDto.role;
      newUser.createdAt = dateVal;
      newUser.lastUpdatedAt = dateVal;

      service.create.mockResolvedValue(newUser);

      const result = await controller.create(createUserDto);

      expect(logger.debug).toHaveBeenCalledWith('Creating a new user');
      expect(service.create).toHaveBeenCalledWith(expect.objectContaining({
        username: createUserDto.username,
        password: createUserDto.password,
        role: createUserDto.role,

      }));
      expect(logger.debug).toHaveBeenCalledWith(`User created with ID: ${newUser.id}`);
      expect(result).toEqual(newUser);
    });

    it('should handle errors when creating a user', async () => {
      const createUserDto: CreateUserDto = { username: 'testuser', password: 'password123', role: UserRole.ADMIN };
      const dateVal = new Date().getTime();

      service.create.mockRejectedValue(new Error('Database error'));

      await expect(controller.create(createUserDto)).rejects.toThrow(
        new InternalServerErrorException('Error creating user'),
      );

      expect(logger.error).toHaveBeenCalledWith('Error creating user', expect.any(Error));
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const dateVal = new Date().getTime();
      const users: User[] = [{ id: 1, username: 'user1', password: 'pass', role: UserRole.CUSTOMER, createdAt: dateVal, lastUpdatedAt: dateVal } as User];
      service.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(logger.debug).toHaveBeenCalledWith('Fetching all users');
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it('should handle errors when fetching users', async () => {
      service.findAll.mockRejectedValue(new Error('Database error'));

      await expect(controller.findAll()).rejects.toThrow(
        new InternalServerErrorException('Error fetching users'),
      );

      expect(logger.error).toHaveBeenCalledWith('Error fetching users', expect.any(Error));
    });
  });

  describe('getProfile', () => {
    it('should return the current user profile', async () => {
      const req = { context: { userId: 1 } };
      const dateVal = new Date().getTime();

      const user: User = { id: 1, username: 'user1', password: 'pass', role: UserRole.CUSTOMER, createdAt: dateVal, lastUpdatedAt: dateVal } as User;
      service.findOne.mockResolvedValue(user);

      const result = await controller.getProfile(req);

      expect(logger.debug).toHaveBeenCalledWith(`Fetching profile for user ID: ${req.context.userId}`);
      expect(service.findOne).toHaveBeenCalledWith(req.context.userId);
      expect(result).toEqual(user);
    });

    it('should handle errors when fetching profile', async () => {
      const req = { context: { userId: 1 } };
      service.findOne.mockRejectedValue(new Error('Database error'));

      await expect(controller.getProfile(req)).rejects.toThrow(
        new InternalServerErrorException('Error fetching profile'),
      );

      expect(logger.error).toHaveBeenCalledWith('Error fetching profile', expect.any(Error));
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const dateVal = new Date().getTime();
      const user = { id: 1, username: 'user1', password: 'pass', role: UserRole.CUSTOMER, createdAt: dateVal, lastUpdatedAt: dateVal } as User;
      service.findOne.mockResolvedValue(user);

      const result = await controller.findOne(1);

      expect(logger.debug).toHaveBeenCalledWith(`Fetching user with ID: 1`);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(user);
    });



    it('should handle errors when fetching user', async () => {
      service.findOne.mockRejectedValue(new Error('Database error'));

      await expect(controller.findOne(1)).rejects.toThrow(
        new InternalServerErrorException('Error fetching user'),
      );

      expect(logger.debug).toHaveBeenCalledWith(`Fetching user with ID: 1`);
      expect(logger.error).toHaveBeenCalledWith(`Error fetching user with ID: 1`, expect.any(Error));
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const updateUserDto: Partial<User> = { username: 'updatedUser' };
      const req = { user: { userId: 1, role: UserRole.ADMIN } };
      const result = { affected: 1 };

      service.update.mockResolvedValue(result);

      const response = await controller.update(1, updateUserDto, req);

      expect(logger.debug).toHaveBeenCalledWith(`Updating user with ID: 1`);
      expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(logger.debug).toHaveBeenCalledWith(`User with ID 1 updated`);
      expect(response).toEqual(result);
    });

    it('should throw UnauthorizedException if user is not authorized', async () => {
      const updateUserDto: Partial<User> = { username: 'updatedUser' };
      const req = { user: { userId: 2, role: UserRole.CUSTOMER } };

      await expect(controller.update(1, updateUserDto, req)).rejects.toThrow(
        new UnauthorizedException(),
      );

      expect(logger.debug).toHaveBeenCalledWith(`Updating user with ID: 1`);
      expect(logger.warn).toHaveBeenCalledWith('Unauthorized attempt to update user');
    });

    it('should handle errors when updating user', async () => {
      const updateUserDto: Partial<User> = { username: 'updatedUser' };
      const req = { user: { userId: 1, role: UserRole.ADMIN } };

      service.update.mockRejectedValue(new Error('Database error'));

      await expect(controller.update(1, updateUserDto, req)).rejects.toThrow(
        new InternalServerErrorException('Error updating user'),
      );

      expect(logger.debug).toHaveBeenCalledWith(`Updating user with ID: 1`);
      expect(logger.error).toHaveBeenCalledWith(`Error updating user with ID: 1`, expect.any(Error));
    });
  });

  describe('remove', () => {
    it('should delete a user successfully', async () => {
      service.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(logger.debug).toHaveBeenCalledWith(`Deleting user with ID: 1`);
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(logger.debug).toHaveBeenCalledWith(`User with ID 1 deleted`);
      expect(result).toEqual({ message: 'User deleted successfully' });
    });


    it('should handle errors when deleting user', async () => {
      service.remove.mockRejectedValue(new Error('Database error'));

      await expect(controller.remove(1)).rejects.toThrow(
        new InternalServerErrorException('Error deleting user'),
      );

      expect(logger.debug).toHaveBeenCalledWith(`Deleting user with ID: 1`);
      expect(logger.error).toHaveBeenCalledWith(`Error deleting user with ID: 1`, expect.any(Error));
    });
  });
});
