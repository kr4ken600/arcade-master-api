import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { loggerSentry } from 'src/utils/sentry.util';
import { ActiveUserInterface } from 'src/interfaces/interfaces';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
  ) {}

  async create(
    createGameDto: CreateGameDto,
    user: ActiveUserInterface,
  ): Promise<Game> {
    try {
      const newGame = this.gamesRepository.create({
        ...createGameDto,
        arcadeId: user.arcadeId,
      });
      return await this.gamesRepository.save(newGame);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'ER_DUP_ENTRY'
      ) {
        throw new ConflictException('¡Ese juego ya está en el catálogo!');
      }

      throw loggerSentry(GamesService.name, error);
    }
  }

  async findAll(): Promise<Game[]> {
    return await this.gamesRepository.find();
  }

  async findOne(id: number, user: ActiveUserInterface): Promise<Game> {
    const game = await this.gamesRepository.findOne({
      where: { id, arcadeId: user.arcadeId },
      relations: ['sessions'],
      order: {
        sessions: {
          score: 'DESC',
        },
      },
    });

    if (!game) {
      throw new NotFoundException(
        `El juego con ID ${id} no existe en las "maquinitas"`,
      );
    }

    return game;
  }

  async update(id: number, updateGameDto: UpdateGameDto): Promise<Game> {
    const game = await this.gamesRepository.preload({
      id: id,
      ...updateGameDto,
    });

    if (!game) {
      throw new NotFoundException(
        `No se puede actualizar: El juego #${id} no existe`,
      );
    }

    try {
      return await this.gamesRepository.save(game);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'ER_DUP_ENTRY'
      ) {
        throw new ConflictException('Ya existe otro juego con ese título');
      }

      throw loggerSentry(GamesService.name, error);
    }
  }

  async remove(id: number, user: ActiveUserInterface): Promise<void> {
    const game = await this.findOne(id, user);

    await this.gamesRepository.remove(game);
  }

  async updateImage(id: number, imageUrl: string, user: ActiveUserInterface) {
    const game = await this.findOne(id, user);

    game.imageUrl = imageUrl;
    await this.gamesRepository.save(game);

    return {
      message: '¡Portada subida con éxito!',
      imageUrl: game.imageUrl,
    };
  }
}
