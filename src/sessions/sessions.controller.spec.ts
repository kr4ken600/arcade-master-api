import { Test, TestingModule } from '@nestjs/testing';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

describe('SessionsController', () => {
  let controller: SessionsController;
  let service: SessionsService;

  const mockSessionService = {
    create: jest.fn((dto) => ({ id: 1, ...dto })),
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
  };

  beforeEach(async () => {
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

  it('should call the service to create a session', async () => {
    const dto = {
      score: 50,
      controllerUsed: "Playstation Dualshock 4",
      gameId: 1
    };

    const result = await controller.create(dto);

    expect(result).toEqual({ id: 1, ...dto });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should call the service to get all sessions', async () => {
    const result = await controller.findAll();

    expect(result).toEqual([
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
    ]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call the service to get one session', async () => {
    const result = await controller.findOne(1);

    expect(result).toEqual({
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
    });
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

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

  it('should call the service to remove a session', async () => {
    const result = await controller.remove(1);

    expect(result).toEqual({ deleted: true });
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
