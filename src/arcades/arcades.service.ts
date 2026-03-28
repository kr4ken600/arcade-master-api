import { Injectable } from '@nestjs/common';
import { CreateArcadeDto } from './dto/create-arcade.dto';
import { UpdateArcadeDto } from './dto/update-arcade.dto';

@Injectable()
export class ArcadesService {
  create(createArcadeDto: CreateArcadeDto) {
    return 'This action adds a new arcade';
  }

  findAll() {
    return `This action returns all arcades`;
  }

  findOne(id: number) {
    return `This action returns a #${id} arcade`;
  }

  update(id: number, updateArcadeDto: UpdateArcadeDto) {
    return `This action updates a #${id} arcade`;
  }

  remove(id: number) {
    return `This action removes a #${id} arcade`;
  }
}
