import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { Repository } from 'typeorm';
import { Game } from 'src/games/entities/game.entity';

@Injectable()
export class SessionsService {

  constructor(
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
  ) { }

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    const { gameId, ...sessionData } = createSessionDto;

    const game = await this.gamesRepository.findOneBy({ id: gameId });
    if (!game) throw new NotFoundException('¡Ese juego no existe en el catálogo!');

    const newSession = this.sessionsRepository.create({
      ...sessionData,
      game: game
    });

    return await this.sessionsRepository.save(newSession);
  }

  async findAll(): Promise<Session[]> {
    return await this.sessionsRepository.find({
      relations: ['game'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Session> {
    const session = await this.sessionsRepository.findOne({
      where: { id },
      relations: ['game']
    });

    if (!session) throw new NotFoundException(`La sesión con ID #${id} no existe`);

    return session;
  }

  async update(id: number, updateSessionDto: UpdateSessionDto): Promise<Session> {
    const session = await this.sessionsRepository.preload({
      id: id,
      ...updateSessionDto
    });

    if(!session) throw new NotFoundException(`La sesión con ID #${id} no existe para actualizar`);
    
    return await this.sessionsRepository.save(session);
  }

  async remove(id: number): Promise<void> {
    const session = await this.findOne(id);
    await this.sessionsRepository.remove(session);
  }
}
