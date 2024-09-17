import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Logger } from 'nestjs-pino';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: jest.Mocked<Partial<Repository<User>>>;
  let logger: jest.Mocked<Logger>;

  beforeEach(async () => {
    // Mocking the repository methods
    usersRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    // Mocking the logger methods
    logger = {
      debug: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      log: jest.fn(),
      verbose: jest.fn(),
      setContext: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    const mockJwtAuthGuard = {
      canActivate: jest.fn().mockReturnValue(true),
    };


    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: usersRepository },
        { provide: Logger, useValue: logger },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    service = module.get<UsersService>(UsersService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByUsername', () => {
    it('should find a user by username', async () => {
      const username = 'testuser';
      const user = { id: 1, username } as User;
      usersRepository.findOne.mockResolvedValue(user);

      const result = await service.findByUsername(username);

      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { username } });
      expect(result).toEqual(user);
      expect(logger.debug).toHaveBeenCalledWith(`Finding user by username: ${username}`);
    });

    it('should handle errors when finding a user by username', async () => {
      const username = 'testuser';
      usersRepository.findOne.mockRejectedValue(new Error('Database error'));

      await expect(service.findByUsername(username)).rejects.toThrow(
        new InternalServerErrorException('Error finding user by username'),
      );

      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { username } });
      expect(logger.error).toHaveBeenCalledWith(
        `Error finding user by username: ${username}`,
        expect.any(Error),
      );
    });
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const user = { username: 'newuser', password: 'password123' } as User;
      const hashedPassword = 'hashedpassword';
      const savedUser = { ...user, id: 1, password: hashedPassword };

      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt');
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      usersRepository.save.mockResolvedValue(savedUser);

      const result = await service.create(user);

      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", "salt");
      expect(usersRepository.save).toHaveBeenCalledWith({ ...user });
      expect(result).toEqual(savedUser);
      expect(logger.debug).toHaveBeenCalledWith(`Creating a new user with username: ${user.username}`);
      expect(logger.debug).toHaveBeenCalledWith(`User created with ID: ${savedUser.id}`);
    });

    it('should handle errors when creating a user', async () => {
      const user = { username: 'newuser', password: 'password123' } as User;

      jest.spyOn(bcrypt, 'genSalt').mockRejectedValue(new Error('Hashing error'));

      await expect(service.create(user)).rejects.toThrow(
        new InternalServerErrorException('Error creating user'),
      );

      expect(logger.error).toHaveBeenCalledWith('Error creating user', expect.any(Error));
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ id: 1, username: 'user1' } as User];
      usersRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(usersRepository.find).toHaveBeenCalled();
      expect(result).toEqual(users);
      expect(logger.debug).toHaveBeenCalledWith('Fetching all users');
    });

    it('should handle errors when fetching all users', async () => {
      usersRepository.find.mockRejectedValue(new Error('Database error'));

      await expect(service.findAll()).rejects.toThrow(
        new InternalServerErrorException('Error fetching users'),
      );

      expect(logger.error).toHaveBeenCalledWith('Error fetching users', expect.any(Error));
    });
  });

  describe('findOne', () => {
    it('should find a user by ID', async () => {
      const user = { id: 1, username: 'user1' } as User;
      usersRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(user);
      expect(logger.debug).toHaveBeenCalledWith('Fetching user with ID: 1');
    });

    it('should throw NotFoundException if user not found', async () => {
      usersRepository.findOne.mockResolvedValue(undefined);

      await expect(service.findOne(1)).rejects.toThrow(
        new NotFoundException('User with ID 1 not found'),
      );

      expect(logger.warn).toHaveBeenCalledWith('User with ID 1 not found');
    });

    it('should handle errors when finding a user by ID', async () => {
      usersRepository.findOne.mockRejectedValue(new Error('Database error'));

      await expect(service.findOne(1)).rejects.toThrow(
        new InternalServerErrorException('Error fetching user'),
      );

      expect(logger.error).toHaveBeenCalledWith(
        'Error fetching user with ID: 1',
        expect.any(Error),
      );
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const updateUser = { username: 'updatedUser' } as Partial<User>;
      usersRepository.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.update(1, updateUser);

      expect(usersRepository.update).toHaveBeenCalledWith(1, updateUser);
      expect(result).toEqual({ affected: 1 });
      expect(logger.debug).toHaveBeenCalledWith('Updating user with ID: 1');
      expect(logger.debug).toHaveBeenCalledWith('User with ID 1 updated');
    });

    it('should hash password if provided in update', async () => {
      const updateUser = { password: 'newpassword' } as Partial<User>;
      const hashedPassword = 'hashedpassword';

      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt');
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      usersRepository.update.mockResolvedValue({ affected: 1 } as any);

      await service.update(1, updateUser);

      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 'salt');
      expect(usersRepository.update).toHaveBeenCalledWith(1, { password: hashedPassword });
    });

    it('should throw NotFoundException if user not found during update', async () => {
      usersRepository.update.mockResolvedValue({ affected: 0 } as any);

      await expect(service.update(1, {})).rejects.toThrow(
        new NotFoundException('User with ID 1 not found'),
      );

      expect(logger.warn).toHaveBeenCalledWith('User with ID 1 not found for update');
    });

    it('should handle errors when updating a user', async () => {
      usersRepository.update.mockRejectedValue(new Error('Database error'));

      await expect(service.update(1, {})).rejects.toThrow(
        new InternalServerErrorException('Error updating user'),
      );

      expect(logger.error).toHaveBeenCalledWith(
        'Error updating user with ID: 1',
        expect.any(Error),
      );
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      usersRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await service.remove(1);

      expect(usersRepository.delete).toHaveBeenCalledWith(1);
      expect(logger.debug).toHaveBeenCalledWith('Deleting user with ID: 1');
      expect(logger.debug).toHaveBeenCalledWith('User with ID 1 deleted');
    });

    it('should throw NotFoundException if user not found during deletion', async () => {
      usersRepository.delete.mockResolvedValue({ affected: 0 } as any);

      await expect(service.remove(1)).rejects.toThrow(
        new NotFoundException('User with ID 1 not found'),
      );

      expect(logger.warn).toHaveBeenCalledWith('User with ID 1 not found for deletion');
    });

    it('should handle errors when removing a user', async () => {
      usersRepository.delete.mockRejectedValue(new Error('Database error'));

      await expect(service.remove(1)).rejects.toThrow(
        new InternalServerErrorException('Error deleting user'),
      );

      expect(logger.error).toHaveBeenCalledWith(
        'Error deleting user with ID: 1',
        expect.any(Error),
      );
    });
  });
});
