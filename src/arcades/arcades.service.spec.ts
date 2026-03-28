import { Test, TestingModule } from '@nestjs/testing';
import { ArcadesService } from './arcades.service';

describe('ArcadesService', () => {
  let service: ArcadesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArcadesService],
    }).compile();

    service = module.get<ArcadesService>(ArcadesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
