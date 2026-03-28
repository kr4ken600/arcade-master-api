import { Module } from '@nestjs/common';
import { ArcadesService } from './arcades.service';
import { ArcadesController } from './arcades.controller';

@Module({
  controllers: [ArcadesController],
  providers: [ArcadesService],
})
export class ArcadesModule {}
