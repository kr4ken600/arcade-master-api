import { Module } from '@nestjs/common';
import { ArcadesService } from './arcades.service';
import { ArcadesController } from './arcades.controller';
import { Arcade } from './entities/arcade.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Arcade])],
  controllers: [ArcadesController],
  providers: [ArcadesService],
  exports: [ArcadesService]
})
export class ArcadesModule {}
