import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArcadesService } from './arcades.service';
import { CreateArcadeDto } from './dto/create-arcade.dto';
import { UpdateArcadeDto } from './dto/update-arcade.dto';

@Controller('arcades')
export class ArcadesController {
  constructor(private readonly arcadesService: ArcadesService) {}

  @Post()
  create(@Body() createArcadeDto: CreateArcadeDto) {
    return this.arcadesService.create(createArcadeDto);
  }

  @Get()
  findAll() {
    return this.arcadesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.arcadesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArcadeDto: UpdateArcadeDto) {
    return this.arcadesService.update(+id, updateArcadeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.arcadesService.remove(+id);
  }
}
