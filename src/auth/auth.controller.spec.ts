import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn((email: string, pass: string) => ({
      access_token: 'esteesuntoken',
      user: {
        id: 1, email: email, username: 'test'
      } 
    })),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should login a user', async () => {
      const result = await controller.login({ email: 'test@test.com', password: '123456' });
      expect(result).toEqual({ access_token: 'esteesuntoken', user: { id: 1, email: 'test@test.com', username: 'test' } });
      expect(service.login).toHaveBeenCalledWith('test@test.com', '123456')
    });
  });
});
