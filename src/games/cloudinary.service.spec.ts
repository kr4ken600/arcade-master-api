import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryService } from './cloudinary.service';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';


jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn(),
    },
  },
}));
jest.mock('streamifier', () => ({
  createReadStream: jest.fn(),
}));

describe('CloudinaryService', () => {
  let service: CloudinaryService;

  beforeEach(async () => {
    
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryService],
    }).compile();

    service = module.get<CloudinaryService>(CloudinaryService);
  });

  it('debería estar definido y configurar Cloudinary', () => {
    expect(service).toBeDefined();
    
    expect(cloudinary.config).toHaveBeenCalled();
  });

  describe('uploadImage', () => {
    
    const mockFile = {
      buffer: Buffer.from('pixels-falsos-de-arcade'),
      originalname: 'kof2002.jpg',
      mimetype: 'image/jpeg',
    } as Express.Multer.File;

    it('debería subir la imagen exitosamente y devolver el resultado', async () => {
      
      const mockCloudinaryResponse = { secure_url: 'https://nube.com/kof2002.jpg' };

      
      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback) => {
          
          callback(undefined, mockCloudinaryResponse);
        }
      );

      
      const mockPipe = jest.fn();
      (streamifier.createReadStream as jest.Mock).mockReturnValue({
        pipe: mockPipe,
      });

      
      const result = await service.uploadImage(mockFile);

      
      expect(result).toEqual(mockCloudinaryResponse);
      expect(streamifier.createReadStream).toHaveBeenCalledWith(mockFile.buffer);
      expect(mockPipe).toHaveBeenCalled();
    });

    it('debería lanzar un Error si la subida falla', async () => {
      
      const mockError = { message: 'Cloudinary API Key Invalid' };

      
      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback) => {
          
          callback(mockError, undefined);
        }
      );

      const mockPipe = jest.fn();
      (streamifier.createReadStream as jest.Mock).mockReturnValue({
        pipe: mockPipe,
      });

      
      await expect(service.uploadImage(mockFile)).rejects.toThrow('Cloudinary API Key Invalid');
    });
  });
});