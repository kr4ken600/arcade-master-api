import { Test, TestingModule } from '@nestjs/testing';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

describe('SessionsController', () => {
  let controller: SessionsController;
  let service: SessionsService;

  const mockSessionService = {
    create: jest.fn((dto, userId) => ({ id: 1, ...dto, user: { id: userId } })),
    findAll: jest.fn(() => [{
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
    }]),
    findOne: jest.fn((id) => ({
      id,
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
    })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    remove: jest.fn(() => ({ deleted: true })),
    getMostPlayedGames: jest.fn(),
    getControllerStats: jest.fn(),
    getHighScores: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionsController],
      providers: [{
        provide: SessionsService,
        useValue: mockSessionService,
      }],
    }).compile();

    controller = module.get<SessionsController>(SessionsController);
    service = module.get<SessionsService>(SessionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call the service to create a session using the user ID from token', async () => {
      const dto = {
        score: 50,
        controllerUsed: "Playstation Dualshock 4",
        gameId: 1
      };

      const mockReq = {
        user: { userId: 99 }
      } as any;

      const result = await controller.create(dto, mockReq);

      expect(result).toEqual({ id: 1, ...dto, user: { id: 99 } });
      expect(service.create).toHaveBeenCalledWith(dto, 99); 
    });
  });

  describe('findAll', () => {
    it('should call the service to get all sessions', async () => {
      const result = await controller.findAll();
      expect(result).toHaveLength(1);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call the service to get one session', async () => {
      const result = await controller.findOne(1);
      expect(result.id).toBe(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should call the service to update a session', async () => {
      const dto = {
        score: 75,
        controllerUsed: "Xbox Wireless Controller",
        gameId: 1
      };
      const result = await controller.update(1, dto);
      expect(result).toEqual({ id: 1, ...dto });
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should call the service to remove a session', async () => {
      const result = await controller.remove(1);
      expect(result).toEqual({ deleted: true });
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('Estadísticas', () => {
    it('debería llamar al servicio para obtener los juegos más jugados', async () => {
      const mockStats = [{ gameTitle: 'KOF 2002', totalSessions: '15' }];
      mockSessionService.getMostPlayedGames.mockReturnValue(mockStats);

      const result = await controller.getMostPlayed();

      expect(result).toEqual(mockStats);
      expect(service.getMostPlayedGames).toHaveBeenCalled();
    });

    it('debería llamar al servicio para obtener las estadísticas de mandos', async () => {
      const mockStats = [{ controller: 'Arcade Stick ESP32', usageCount: '42' }];
      mockSessionService.getControllerStats.mockReturnValue(mockStats);

      const result = await controller.getControllerStats();

      expect(result).toEqual(mockStats);
      expect(service.getControllerStats).toHaveBeenCalled();
    });

    it('debería llamar al servicio para obtener los high scores de un juego', async () => {
      const mockScores = [{ id: 1, score: 99500, user: { username: 'IOR' } }];
      mockSessionService.getHighScores.mockReturnValue(mockScores);

      const result = await controller.getHighScores(5);

      expect(result).toEqual(mockScores);
      expect(service.getHighScores).toHaveBeenCalledWith(5);
    });
  });
});