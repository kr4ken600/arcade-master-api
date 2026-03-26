import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRespository = {
    nd: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
    remove: jest.fn(),
  }

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRespository,
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto = {
      email: 'iori@arcade.com',
      username: 'Iori',
      password: 'password123',
    };

    it('debería encriptar la contraseña y guardar el usuario exitosamente', async () => {
      const hashedPassword = 'hashed_password_123';
      const savedUser = { id: 1, ...createUserDto, password: hashedPassword };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      mockUserRespository.create.mockReturnValue(savedUser);
      mockUserRespository.save.mockResolvedValue(savedUser);

      const result = await service.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockUserRespository.create).toHaveBeenCalledWith({
        email: 'iori@arcade.com',
        username: 'Iori',
        password: hashedPassword,
      });
      expect(mockUserRespository.save).toHaveBeenCalledWith(savedUser);

      expect(result).toEqual(savedUser);
    });

    it('debería lanzar ConflictException si hay un duplicado (ER_DUP_ENTRY)', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      mockUserRespository.create.mockReturnValue({});

      mockUserRespository.save.mockRejectedValue({ code: 'ER_DUP_ENTRY' });

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });

    it('debería lanzar InternalServerErrorException si ocurre cualquier otro error', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      mockUserRespository.create.mockReturnValue({});

      mockUserRespository.save.mockRejectedValue(new Error('Base de datos desconectada'));

      await expect(service.create(createUserDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findByEmail', () => {
    it('debería buscar un usuario por su correo', async () => {
      const mockUser = { id: 1, email: 'iori@arcade.com', username: 'Iori' };

      mockUserRespository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('iori@arcade.com');

      expect(mockUserRespository.findOne).toHaveBeenCalledWith({
        where: { email: 'iori@arcade.com' },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('debería devolver todos los usuarios', async () => {
      const mockUsers = [
        { id: 1, email: 'iori@arcade.com', username: 'Iori' },
        { id: 2, email: 'jin@arcade.com', username: 'Jin' }
      ];

      mockUserRespository.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(mockUserRespository.find).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('debería devolver un usuario por su ID', async () => {
      const mockUser = { id: 1, email: 'iori@arcade.com', username: 'Iori' };

      mockUserRespository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(mockUserRespository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockUser);
    });

    it('debería lanzar NotFoundException si el usuario no existe', async () => {
      mockUserRespository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('debería actualizar un usuario existente', async () => {
      const updateUserDto = { email: 'ioriUpdated@arcade.com' };
      const mockUser = { id: 1, email: 'iori@arcade.com', username: 'Iori' };
      const updatedUser = { ...mockUser, ...updateUserDto };

      mockUserRespository.preload.mockResolvedValue(updatedUser);
      mockUserRespository.save.mockResolvedValue(updatedUser);

      const result = await service.update(1, updateUserDto);

      expect(mockUserRespository.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateUserDto,
      });
      expect(mockUserRespository.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(updatedUser);
    });

    it('debería lanzar NotFoundException si el usuario a actualizar no existe', async () => {
      const updateUserDto = { email: 'ioriUpdated@arcade.com' };

      mockUserRespository.preload.mockResolvedValue(undefined);

      await expect(service.update(999, updateUserDto)).rejects.toThrow();
    });

    it('debería lanzar ConflictException si hay un duplicado al actualizar', async () => {
      const updateUserDto = { email: 'ioriUpdated@arcade.com' };
      const mockUser = { id: 1, email: 'iori@arcade.com', username: 'Iori' };
      const updatedUser = { ...mockUser, ...updateUserDto };

      mockUserRespository.preload.mockResolvedValue(updatedUser);
      mockUserRespository.save.mockRejectedValue({ code: 'ER_DUP_ENTRY' });

      await expect(service.update(1, updateUserDto)).rejects.toThrow(ConflictException);
    });

    it('debería lanzar InternalServerErrorException si ocurre cualquier otro error al actualizar', async () => {
      const updateUserDto = { email: 'ioriUpdated@arcade.com' };
      const mockUser = { id: 1, email: 'iori@arcade.com', username: 'Iori' };
      const updatedUser = { ...mockUser, ...updateUserDto };

      mockUserRespository.preload.mockResolvedValue(updatedUser);
      mockUserRespository.save.mockRejectedValue(new Error('Error de base de datos'));

      await expect(service.update(1, updateUserDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('remove', () => {
    it('debería eliminar un usuario existente', async () => {
      const mockUser = { id: 1, email: 'iori@arcade.com', username: 'Iori' };

      mockUserRespository.findOneBy.mockResolvedValue(mockUser);
      mockUserRespository.remove.mockResolvedValue(undefined);

      await service.remove(1);

      expect(mockUserRespository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockUserRespository.remove).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('findByEmail', () => {
    it('debería lanzar NotFoundException si el usuario no existe', async () => {
      mockUserRespository.findOne.mockResolvedValue(null);

      await expect(service.findByEmail('nonexistent@arcade.com')).rejects.toThrow();
    });
  });
});
