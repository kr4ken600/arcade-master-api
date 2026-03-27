import { Test, TestingModule } from '@nestjs/testing';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { CloudinaryService } from './cloudinary.service';
import { BadRequestException } from '@nestjs/common';

describe('GamesController', () => {
  let controller: GamesController;
  let gamesService: GamesService;
  let cloudinaryService: CloudinaryService;

  const mockGamesService = {
    create: jest.fn((dto) => ({ id: 1, ...dto })),
    findAll: jest.fn(() => [{ id: 1, title: 'KOF 2002' }]),
    findOne: jest.fn((id) => ({ id, title: 'KOF 2002' })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    remove: jest.fn(() => ({ deleted: true })),
    updateImage: jest.fn((id, imageUrl) => ({ id, imageUrl })),
  };

  const mockCloudinaryService = {
    uploadImage: jest.fn(),
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
        {
          provide: CloudinaryService,
          useValue: mockCloudinaryService,
        },
      ],
    }).compile();

    controller = module.get<GamesController>(GamesController);
    gamesService = module.get<GamesService>(GamesService);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería llamar al service para crear un juego', async () => {
      const dto: CreateGameDto = { title: 'Metal Slug', genre: 'Action', year: 1996 };
      const result = await controller.create(dto);

      expect(result).toEqual({ id: 1, ...dto });
      expect(gamesService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('debería llamar al servicio para devolver todos los juegos', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([{ id: 1, title: 'KOF 2002' }]);
      expect(gamesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería llamar al service con un ID numérico', async () => {
      await controller.findOne('5');
      expect(gamesService.findOne).toHaveBeenCalledWith(5);
    });
  });

  describe('update', () => {
    it('debería llamar al servicio para actualizar un juego', async () => {
      await controller.update(1, { title: 'updated title' });
      expect(gamesService.update).toHaveBeenCalledWith(1, { title: 'updated title' });
    });
  });

  describe('remove', () => {
    it('debería llamar al service para eliminar', async () => {
      await controller.remove(1);
      expect(gamesService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('uploadGameImage', () => {
    it('debería lanzar BadRequestException si no se adjunta archivo', async () => {
      await expect(controller.uploadGameImage(1, undefined as any)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.uploadGameImage(1, undefined as any)).rejects.toThrow(
        '¡Olvidaste adjuntar la imagen!',
      );
    });

    it('debería subir la imagen a Cloudinary y actualizar la base de datos', async () => {
      const mockFile = {
        originalname: 'portada.jpg',
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      const mockCloudinaryResponse = { secure_url: 'https://nube.com/portada.jpg' };
      mockCloudinaryService.uploadImage.mockResolvedValue(mockCloudinaryResponse);

      const result = await controller.uploadGameImage(1, mockFile);

      expect(cloudinaryService.uploadImage).toHaveBeenCalledWith(mockFile);
      
      expect(gamesService.updateImage).toHaveBeenCalledWith(1, mockCloudinaryResponse.secure_url);
      
      expect(result).toEqual({ id: 1, imageUrl: mockCloudinaryResponse.secure_url });
    });
  });
});