import { Test, TestingModule } from '@nestjs/testing';
import { ArcadesController } from './arcades.controller';
import { ArcadesService } from './arcades.service';

describe('ArcadesController', () => {
  let controller: ArcadesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArcadesController],
      providers: [ArcadesService],
    }).compile();

    controller = module.get<ArcadesController>(ArcadesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
