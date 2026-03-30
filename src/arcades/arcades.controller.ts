import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ArcadesService } from './arcades.service';
import { CreateArcadeDto } from './dto/create-arcade.dto';

@Controller('arcades')
export class ArcadesController {
  constructor(private readonly arcadesService: ArcadesService) {}

  @Post()
  create(@Body() createArcadeDto: CreateArcadeDto) {
    return this.arcadesService.create(createArcadeDto);
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.arcadesService.findOne(name);
  }

  @Delete(':name')
  remove(@Param('name') name: string) {
    return this.arcadesService.remove(name);
  }
}
