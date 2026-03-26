import { Test, TestingModule } from '@nestjs/testing';
import { SessionsService } from './sessions.service';
import { Game } from 'src/games/entities/game.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';

describe('SessionsService', () => {
  let service: SessionsService;

  const mockGamesRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
    remove: jest.fn(),
  };

  const mockSessionsRepository = {
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
        SessionsService,
        {
          provide: getRepositoryToken(Game),
          useValue: mockGamesRepository,
        },
        {
          provide: getRepositoryToken(Session),
          useValue: mockSessionsRepository,
        },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a session successfully', async () => {
      let createSessionMock = {
        score: 50,
        controllerUsed: "Playstation Dualshock 4",
        gameId: 1
      };

      const game = {
        id: 1,
        title: "The King of Fighters 97",
        genre: "Fighting",
        year: 1997,
        isActive: true
      };

      const newSession = {
        id: 1,
        createdAt: "2026-03-26T14:34:36.000Z",
        ...createSessionMock,
        game: game,
      };

      mockGamesRepository.findOneBy.mockResolvedValue(game);
      mockSessionsRepository.create.mockReturnValue(newSession);
      mockSessionsRepository.save.mockResolvedValue(newSession);

      const result = await service.create(createSessionMock);
      console.log(newSession, result);


      expect(result).toEqual(newSession);
      expect(mockGamesRepository.findOneBy).toHaveBeenCalledWith({
        id: createSessionMock.gameId,
      });

      const { gameId, ...sessionWithoutGameId } = createSessionMock;

      expect(mockSessionsRepository.create).toHaveBeenCalledWith({
        ...sessionWithoutGameId,
        game: game,
      });
      expect(mockSessionsRepository.save).toHaveBeenCalledWith(newSession);
    });

    it('should throw NotFoundException when game is not found', async () => {
      const createSessionMock = {
        score: 50,
        controllerUsed: "Playstation Dualshock 4",
        gameId: 999
      };

      mockGamesRepository.findOneBy.mockResolvedValue(null);

      await expect(service.create(createSessionMock)).rejects.toThrow(
        '¡Ese juego no existe en el catálogo!',
      );

      expect(mockGamesRepository.findOneBy).toHaveBeenCalledWith({
        id: createSessionMock.gameId,
      });
      expect(mockSessionsRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should find all sessions', async () => {
      const sessionsMock = [
        {
          id: 2,
          score: 300,
          controllerUsed: "Playstation Dualshock 4",
          createdAt: "2026-03-26T14:34:36.000Z",
          game: {
            id: 1,
            title: "The King of Fighters 97",
            genre: "Fighting",
            year: 1997,
            isActive: true
          }
        },
        {
          id: 1,
          score: 50,
          controllerUsed: "Playstation Dualshock 4",
          createdAt: "2026-03-25T19:17:07.000Z",
          game: {
            id: 1,
            title: "The King of Fighters 97",
            genre: "Fighting",
            year: 1997,
            isActive: true
          }
        }
      ];

      mockSessionsRepository.find.mockReturnValue(sessionsMock);

      const sesions = await service.findAll();

      expect(sesions).toBe(sessionsMock);
    });
  });

  describe('findOne', () => {
    it('should find one session by id', async () => {
      const sessionMock = {
        id: 1,
        score: 50,
        controllerUsed: "Playstation Dualshock 4",
        createdAt: "2026-03-25T19:17:07.000Z",
        game: {
          id: 1,
          title: "The King of Fighters 97",
          genre: "Fighting",
          year: 1997,
          isActive: true
        }
      };

      mockSessionsRepository.findOne.mockReturnValue(sessionMock);

      const session = await service.findOne(1);

      expect(session).toBe(sessionMock);
    });

    it('should throw NotFoundException when session is not found', async () => {
      mockSessionsRepository.findOne.mockReturnValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        'La sesión con ID #999 no existe'
      );
    });
  });

  describe('update', () => {
    it('should update a session', async () => {
      const updateSessionMock = {
        score: 100,
        controllerUsed: "Xbox Wireless Controller"
      };

      const sessionMock = {
        id: 1,
        score: 50,
        controllerUsed: "Playstation Dualshock 4",
        createdAt: "2026-03-25T19:17:07.000Z",
        game: {
          id: 1,
          title: "The King of Fighters 97",
          genre: "Fighting",
          year: 1997,
          isActive: true
        }
      };

      const updatedSession = {
        ...sessionMock,
        ...updateSessionMock
      }

      mockSessionsRepository.preload.mockReturnValue(updatedSession);
      mockSessionsRepository.save.mockResolvedValue(updatedSession);

      const result = await service.update(1, updateSessionMock);

      expect(result).toEqual(updatedSession);
      expect(mockSessionsRepository.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateSessionMock
      });
      expect(mockSessionsRepository.save).toHaveBeenCalledWith(updatedSession);
    });

    it('should throw NotFoundException when session to update is not found', async () => {
      const updateSessionMock = {
        score: 100,
        controllerUsed: "Xbox Wireless Controller"
      };

      mockSessionsRepository.preload.mockReturnValue(null);

      await expect(service.update(999, updateSessionMock)).rejects.toThrow(
        'La sesión con ID #999 no existe para actualizar'
      );

      expect(mockSessionsRepository.preload).toHaveBeenCalledWith({
        id: 999,
        ...updateSessionMock
      });
      expect(mockSessionsRepository.save).not.toHaveBeenCalled();
    });

    it('should handle internal server error during update', async () => {
      const updateSessionMock = {
        score: 100,
        controllerUsed: "Xbox Wireless Controller"
      };

      const sessionMock = {
        id: 1,
        score: 50,
        controllerUsed: "Playstation Dualshock 4",
        createdAt: "2026-03-25T19:17:07.000Z",
        game: {
          id: 1,
          title: "The King of Fighters 97",
          genre: "Fighting",
          year: 1997,
          isActive: true
        }
      };

      const updatedSession = {
        ...sessionMock,
        ...updateSessionMock
      }

      mockSessionsRepository.preload.mockReturnValue(updatedSession);
      mockSessionsRepository.save.mockRejectedValue(new Error("Internal Server Error"));

      expect(
        service.update(1, updateSessionMock)
      ).rejects.toThrowErrorMatchingInlineSnapshot(`"Internal Server Error"`);
    });
  });

  describe('remove', () => {
    it('should remove a session', async () => {
      const sessionMock = {
        id: 1,
        score: 50,
        controllerUsed: "Playstation Dualshock 4",
        createdAt: "2026-03-25T19:17:07.000Z",
        game: {
          id: 1,
          title: "The King of Fighters 97",
          genre: "Fighting",
          year: 1997,
          isActive: true
        }
      };

      mockSessionsRepository.findOne.mockReturnValue(sessionMock);
      mockSessionsRepository.remove.mockReturnValue(undefined);

      await service.remove(1);

      expect(mockSessionsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['game'],
      });
      expect(mockSessionsRepository.remove).toHaveBeenCalledWith(sessionMock);
    });
  });
});
