import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
  ) { }

  async create(createGameDto: CreateGameDto): Promise<Game> {
    try {
      const newGame = this.gamesRepository.create(createGameDto);
      return await this.gamesRepository.save(newGame);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('¡Ese juego ya está en el catálogo!');
      }

      throw new InternalServerErrorException('Algo salió muy mal en el servidor');
    }
  }

  async findAll(): Promise<Game[]> {
    return await this.gamesRepository.find();
  }

  async findOne(id: number): Promise<Game> {
    const game = await this.gamesRepository.findOneBy({ id });

    if (!game) {
      throw new NotFoundException(`El juego con ID ${id} no existe en las "maquinitas"`);
    }

    return game;
  }

  async update(id: number, updateGameDto: UpdateGameDto): Promise<Game> {
    const game = await this.gamesRepository.preload({
      id: id,
      ...updateGameDto
    });

    if (!game) {
      throw new NotFoundException(`No se puede actualizar: El juego #${id} no existe`);
    }

    try {
      return await this.gamesRepository.save(game);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Ya existe otro juego con ese título');
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number): Promise<void> {
    const game = await this.findOne(id);

    await this.gamesRepository.remove(game);
  }
}
