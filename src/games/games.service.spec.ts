import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { NotFoundException } from '@nestjs/common';

describe('GamesService', () => {
  let service: GamesService;

  const mockGamesRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: getRepositoryToken(Game),
          useValue: mockGamesRepository,
        },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return an game when game exists', async () => {
      const expectedGame = { id: 1, title: 'KOF 2002', genre: 'Fighting' };
      mockGamesRepository.findOne.mockReturnValue(expectedGame);

      const game = await service.findOne(1);

      expect(await service.findOne(1)).toBe(game);
    });

    it('should throw an error when game does not exist', async () => {
      mockGamesRepository.findOne.mockReturnValue(null);

      try {
        await service.findOne(999);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toContain(
          'El juego con ID 999 no existe en las "maquinitas"',
        );
      }
    });
  });

  describe('findAll', () => {
    it('should return all games', async () => {
      const expectedGames = [
        { id: 1, title: 'KOF 2002', genre: 'Fighting' },
        { id: 2, title: 'Super Mario', genre: 'Platform' },
      ];

      mockGamesRepository.find.mockReturnValue(expectedGames);

      const game = await service.findAll();

      expect(await service.findAll()).toBe(game);
    });
  });

  describe('create', () => {
    it('should create a new game', async () => {
      const createGameDto = { title: 'New Game', genre: 'Action', year: 1998 };
      const expectedGame = { id: 2, ...createGameDto };

      mockGamesRepository.create.mockReturnValue(expectedGame);
      mockGamesRepository.save.mockResolvedValue(expectedGame);

      const result = await service.create(createGameDto);

      expect(result).toBe(expectedGame);
      expect(mockGamesRepository.create).toHaveBeenCalledWith(createGameDto);
      expect(mockGamesRepository.save).toHaveBeenCalledWith(expectedGame);
    });

    it('should handle duplicate entry error', async () => {
      const createGameDto = { title: 'New Game', genre: 'Action', year: 1998 };

      mockGamesRepository.save.mockRejectedValue({ code: 'ER_DUP_ENTRY' });

      expect(service.create(createGameDto)).rejects.toThrow(
        '¡Ese juego ya está en el catálogo!',
      );
    });

    it('should handle internal server error', async () => {
      const createGameDto = { title: 'New Game', genre: 'Action', year: 1998 };

      mockGamesRepository.save.mockRejectedValue(new Error());

      expect(
        service.create(createGameDto),
      ).rejects.toThrowErrorMatchingInlineSnapshot(`"Ocurrió un error inesperado en el Arcade. Por favor, inténtalo de nuevo más tarde."`);
    });
  });

  describe('update', () => {
    it('should update an existing game', async () => {
      const updateGameDto = { title: 'Updated Game', genre: 'Action' };
      const existingGame = { id: 1, title: 'Old Game', genre: 'RPG' };
      const updatedGame = { ...existingGame, ...updateGameDto };

      mockGamesRepository.preload.mockResolvedValue(updatedGame);
      mockGamesRepository.save.mockResolvedValue(updatedGame);

      const result = await service.update(1, updateGameDto);

      expect(result).toBe(updatedGame);
      expect(mockGamesRepository.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateGameDto,
      });
      expect(mockGamesRepository.save).toHaveBeenCalledWith(updatedGame);
    });

    it('should throw NotFoundException when updating non-existing game', async () => {
      const updateGameDto = { title: 'Updated Game', genre: 'Action' };

      mockGamesRepository.preload.mockResolvedValue(undefined);

      expect(service.update(999, updateGameDto)).rejects.toThrow(
        'No se puede actualizar: El juego #999 no existe',
      );
    });

    it('should handle duplicate entry error during update', async () => {
      const updateGameDto = { title: 'Updated Game', genre: 'Action' };
      const existingGame = { id: 1, title: 'Old Game', genre: 'RPG' };
      const updatedGame = { ...existingGame, ...updateGameDto };

      mockGamesRepository.preload.mockResolvedValue(updatedGame);
      mockGamesRepository.save.mockRejectedValue({ code: 'ER_DUP_ENTRY' });

      expect(service.update(1, updateGameDto)).rejects.toThrow(
        'Ya existe otro juego con ese título',
      );
    });

    it('should handle internal server error during update', async () => {
      const updateGameDto = { title: 'Updated Game', genre: 'Action' };
      const existingGame = { id: 1, title: 'Old Game', genre: 'RPG' };
      const updatedGame = { ...existingGame, ...updateGameDto };

      mockGamesRepository.preload.mockResolvedValue(updatedGame);
      mockGamesRepository.save.mockRejectedValue(new Error());

      expect(
        service.update(1, updateGameDto),
      ).rejects.toThrowErrorMatchingInlineSnapshot(`"Ocurrió un error inesperado en el Arcade. Por favor, inténtalo de nuevo más tarde."`);
    });
  });

  describe('remove', () => {
    it('should remove an existing game', async () => {
      const existingGame = { id: 1, title: 'Old Game', genre: 'RPG' };

      mockGamesRepository.findOne.mockResolvedValue(existingGame);
      mockGamesRepository.remove.mockResolvedValue(undefined);

      await service.remove(1);

      expect(mockGamesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['sessions'],
        order: {
          sessions: {
            score: 'DESC',
          },
        },
      });

      expect(mockGamesRepository.remove).toHaveBeenCalledWith(existingGame);
    });

    it('should throw NotFoundException when removing non-existing game', async () => {
      mockGamesRepository.findOne.mockResolvedValue(null);

      expect(service.remove(999)).rejects.toThrow(
        'El juego con ID 999 no existe en las "maquinitas"',
      );
    });
  });

  describe('updateImage', () => {
    it('debería actualizar la imagen del juego y devolver el mensaje de éxito', async () => {
      const existingGame = { id: 1, title: 'KOF 2002', imageUrl: null };
      const newImageUrl = 'https://nube.com/portada.jpg';

      mockGamesRepository.findOne.mockResolvedValue(existingGame);

      mockGamesRepository.save.mockResolvedValue({ ...existingGame, imageUrl: newImageUrl });

      const result = await service.updateImage(1, newImageUrl);

      expect(existingGame.imageUrl).toBe(newImageUrl);

      expect(mockGamesRepository.save).toHaveBeenCalledWith(existingGame);

      expect(result).toEqual({
        message: '¡Portada subida con éxito!',
        imageUrl: newImageUrl,
      });
    });

    it('debería lanzar NotFoundException si el juego no existe al intentar subir imagen', async () => {
      mockGamesRepository.findOne.mockResolvedValue(null);

      await expect(service.updateImage(999, 'https://nube.com/test.jpg')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
