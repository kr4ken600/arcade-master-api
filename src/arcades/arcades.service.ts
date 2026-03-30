import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArcadeDto } from './dto/create-arcade.dto';
import { Arcade } from './entities/arcade.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { loggerSentry } from 'src/utils/sentry.util';

@Injectable()
export class ArcadesService {
  constructor(
    @InjectRepository(Arcade)
    private readonly arcadesRepository: Repository<Arcade>,
  ) {}

  async create(createArcadeDto: CreateArcadeDto) {
    try {
      const newArcade = this.arcadesRepository.create(createArcadeDto);
      return await this.arcadesRepository.save(newArcade);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'ER_DUP_ENTRY'
      ) {
        throw new ConflictException('¡Ese Arcade ya existe!');
      }

      throw loggerSentry(ArcadesService.name, error);
    }
  }

  async findOne(name: string) {
    const arcade = await this.arcadesRepository.findOne({
      where: { businessName: name },
    });
    if (!arcade) {
      throw new NotFoundException('¡Ese Arcade no existe!');
    }
    return arcade;
  }

  async remove(name: string) {
    const arcade = await this.arcadesRepository.findOne({
      where: { businessName: name },
    });
    if (!arcade) {
      throw new NotFoundException('¡Ese Arcade no existe!');
    }
    return this.arcadesRepository.delete(arcade);
  }
}
