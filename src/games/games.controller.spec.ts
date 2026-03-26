import { Test, TestingModule } from '@nestjs/testing';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

describe('GamesController', () => {
  let controller: GamesController;
  let service: GamesService;

  const mockGamesService = {
    create: jest.fn((dto) => ({ id: 1, ...dto })),
    findAll: jest.fn(() => [{ id: 1, title: 'KOF 2002' }]),
    findOne: jest.fn((id) => ({ id, title: 'KOF 2002' })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    remove: jest.fn(() => ({ deleted: true })),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [
        {
          provide: GamesService,
          useValue: mockGamesService,
        },
      ],
    }).compile();

    controller = module.get<GamesController>(GamesController);
    service = module.get<GamesService>(GamesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería llamar al service para crear un juego', async () => {
      const dto: CreateGameDto = { title: 'Metal Slug', genre: 'Action', year: 1996 };
      const result = await controller.create(dto);

      expect(result).toEqual({ id: 1, ...dto });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('debería llamar al servicio para devolver todos los juegos', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([{ id: 1, title: 'KOF 2002' }]);
      expect(service.findAll).toHaveBeenCalled();
    })
  })

  describe('findOne', () => {
    it('debería llamar al service con un ID numérico', async () => {
      await controller.findOne('5');

      expect(service.findOne).toHaveBeenCalledWith(5);
    });
  });

  describe('update', () => {
    it('debería llamar al servicio para actualizar un juego', async () => {
      await controller.update(1, { title: 'updated title' });

      expect(service.update).toHaveBeenCalledWith(1, { title: 'updated title' });
    })
  })

  describe('remove', () => {
    it('debería llamar al service para eliminar', async () => {
      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});