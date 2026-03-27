import { Test, TestingModule } from '@nestjs/testing';
import { SessionsService } from './sessions.service';
import { Game } from 'src/games/entities/game.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { SessionsGateway } from './sessions.gateway';
import { NotFoundException } from '@nestjs/common';

describe('SessionsService', () => {
  let service: SessionsService;

  
  const mockSessionsGateway = {
    broadcastNewRecord: jest.fn(),
  };

  
  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    getRawMany: jest.fn(),
  };

  const mockGamesRepository = {
    findOneBy: jest.fn(),
  };

  const mockSessionsRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    
    jest.spyOn(console, 'log').mockImplementation(() => {});

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: getRepositoryToken(Game),
          useValue: mockGamesRepository,
        },
        {
          provide: getRepositoryToken(Session),
          useValue: mockSessionsRepository,
        },
        {
          provide: SessionsGateway,
          useValue: mockSessionsGateway, 
        },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createSessionMock = {
      score: 50,
      controllerUsed: 'Playstation Dualshock 4',
      gameId: 1,
    };
    const game = { id: 1, title: 'KOF 97' };
    const userId = 99; 

    it('debería crear la sesión y emitir WebSocket si es un nuevo récord', async () => {
      mockGamesRepository.findOneBy.mockResolvedValue(game);
      
      
      jest.spyOn(service, 'compareScores').mockResolvedValue(true);
      
      const newSession = { id: 1, ...createSessionMock, game, user: { id: userId } };
      mockSessionsRepository.create.mockReturnValue(newSession);
      mockSessionsRepository.save.mockResolvedValue(newSession);

      const result = await service.create(createSessionMock, userId);

      expect(result).toEqual(newSession);
      expect(mockSessionsGateway.broadcastNewRecord).toHaveBeenCalledWith({
        message: '¡NUEVO RÉCORD ESTABLECIDO!',
        score: newSession.score,
        gameId: createSessionMock.gameId,
        controller: createSessionMock.controllerUsed,
      });
    });

    it('debería crear la sesión SIN emitir WebSocket si NO es un récord', async () => {
      mockGamesRepository.findOneBy.mockResolvedValue(game);
      
      
      jest.spyOn(service, 'compareScores').mockResolvedValue(false);
      
      const newSession = { id: 1, ...createSessionMock, game, user: { id: userId } };
      mockSessionsRepository.create.mockReturnValue(newSession);
      mockSessionsRepository.save.mockResolvedValue(newSession);

      await service.create(createSessionMock, userId);

      
      expect(mockSessionsRepository.save).toHaveBeenCalled();
      expect(mockSessionsGateway.broadcastNewRecord).not.toHaveBeenCalled();
    });

    it('debería lanzar NotFoundException si el juego no existe', async () => {
      mockGamesRepository.findOneBy.mockResolvedValue(null);

      await expect(service.create(createSessionMock, userId)).rejects.toThrow(
        '¡Ese juego no existe en el catálogo!',
      );
    });
  });

  describe('findAll', () => {
    it('debería obtener todas las sesiones ordenadas y con relaciones', async () => {
      const sessionsMock = [{ id: 1, score: 50 }];
      mockSessionsRepository.find.mockResolvedValue(sessionsMock);

      const result = await service.findAll();

      expect(result).toBe(sessionsMock);
      expect(mockSessionsRepository.find).toHaveBeenCalledWith({
        relations: ['game'],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('debería encontrar una sesión por ID', async () => {
      const sessionMock = { id: 1, score: 50 };
      mockSessionsRepository.findOne.mockResolvedValue(sessionMock);

      const result = await service.findOne(1);

      expect(result).toBe(sessionMock);
    });

    it('debería lanzar NotFoundException si no encuentra la sesión', async () => {
      mockSessionsRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow('La sesión con ID #999 no existe');
    });
  });

  describe('update', () => {
    it('debería actualizar una sesión', async () => {
      const updateMock = { score: 100 };
      const updatedSession = { id: 1, score: 100 };

      mockSessionsRepository.preload.mockResolvedValue(updatedSession);
      mockSessionsRepository.save.mockResolvedValue(updatedSession);

      const result = await service.update(1, updateMock);

      expect(result).toBe(updatedSession);
    });

    it('debería lanzar NotFoundException si la sesión a actualizar no existe', async () => {
      mockSessionsRepository.preload.mockResolvedValue(null);

      await expect(service.update(999, { score: 100 })).rejects.toThrow(
        'La sesión con ID #999 no existe para actualizar',
      );
    });
  });

  describe('remove', () => {
    it('debería eliminar una sesión', async () => {
      const sessionMock = { id: 1, score: 50 };
      
      jest.spyOn(service, 'findOne').mockResolvedValue(sessionMock as any);
      mockSessionsRepository.remove.mockResolvedValue(undefined);

      await service.remove(1);

      expect(mockSessionsRepository.remove).toHaveBeenCalledWith(sessionMock);
    });
  });

  describe('Estadísticas y QueryBuilder', () => {
    it('getHighScores debería retornar el top de puntuaciones', async () => {
      const mockScores = [{ score: 100 }];
      mockQueryBuilder.getMany.mockResolvedValue(mockScores);

      const result = await service.getHighScores(1);
      expect(result).toBe(mockScores);
    });

    it('getHighScores debería lanzar NotFoundException si no hay records', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]); 

      await expect(service.getHighScores(1)).rejects.toThrow(
        'No hay puntuaciones registradas para este juego',
      );
    });

    it('getMostPlayedGames debería retornar los juegos más jugados', async () => {
      const mockResult = [{ gameTitle: 'KOF', totalSessions: '10' }];
      mockQueryBuilder.getRawMany.mockResolvedValue(mockResult);

      const result = await service.getMostPlayedGames();
      expect(result).toBe(mockResult);
    });

    it('getControllerStats debería retornar las estadísticas de mandos', async () => {
      const mockResult = [{ controller: 'Arcade Stick', usageCount: '5' }];
      mockQueryBuilder.getRawMany.mockResolvedValue(mockResult);

      const result = await service.getControllerStats();
      expect(result).toBe(mockResult);
    });
  });

  describe('compareScores', () => {
    it('debería retornar false si no existe una sesión previa', async () => {
      mockSessionsRepository.findOne.mockResolvedValue(null);
      
      const result = await service.compareScores(100, 1);
      expect(result).toBe(false);
    });

    it('debería retornar true si el nuevo score es mayor al histórico', async () => {
      mockSessionsRepository.findOne.mockResolvedValue({ score: 50 }); 
      
      const result = await service.compareScores(100, 1); 
      expect(result).toBe(true);
    });

    it('debería retornar false si el nuevo score es menor o igual al histórico', async () => {
      mockSessionsRepository.findOne.mockResolvedValue({ score: 100 }); 
      
      const result = await service.compareScores(80, 1); 
      expect(result).toBe(false);
    });
  });
});