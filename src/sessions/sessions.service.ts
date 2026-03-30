import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { Repository } from 'typeorm';
import { Game } from 'src/games/entities/game.entity';
import { SessionsGateway } from './sessions.gateway';
import { ActiveUserInterface } from 'src/interfaces/interfaces';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
    private readonly sessionsGateway: SessionsGateway,
  ) {}

  async create(
    createSessionDto: CreateSessionDto,
    user: ActiveUserInterface,
  ): Promise<Session> {
    const { gameId, ...sessionData } = createSessionDto;

    const game = await this.gamesRepository.findOneBy({ id: gameId });
    if (!game)
      throw new NotFoundException('¡Ese juego no existe en el catálogo!');
    const newSession = this.sessionsRepository.create({
      ...sessionData,
      game: game,
      user: { id: user.userId },
      arcadeId: user.arcadeId,
    });

    const compareScore = await this.compareScores(
      newSession.score,
      createSessionDto.gameId,
    );
    const savedSession = await this.sessionsRepository.save(newSession);

    if (compareScore) {
      this.sessionsGateway.broadcastNewRecord({
        message: '¡NUEVO RÉCORD ESTABLECIDO!',
        score: savedSession.score,
        gameId: createSessionDto.gameId,
        controller: savedSession.controllerUsed,
      });
    }

    return savedSession;
  }

  async findAll(user: ActiveUserInterface): Promise<Session[]> {
    return await this.sessionsRepository.find({
      relations: ['game'],
      where: { arcadeId: user.arcadeId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, user: ActiveUserInterface): Promise<Session> {
    const session = await this.sessionsRepository.findOne({
      where: { id, arcadeId: user.arcadeId },
      relations: ['game'],
    });

    if (!session)
      throw new NotFoundException(`La sesión con ID #${id} no existe`);

    return session;
  }

  async update(
    id: number,
    updateSessionDto: UpdateSessionDto,
  ): Promise<Session> {
    const session = await this.sessionsRepository.preload({
      id: id,
      ...updateSessionDto,
    });

    if (!session)
      throw new NotFoundException(
        `La sesión con ID #${id} no existe para actualizar`,
      );

    return await this.sessionsRepository.save(session);
  }

  async remove(id: number, user: ActiveUserInterface): Promise<void> {
    const session = await this.findOne(id, user);
    await this.sessionsRepository.remove(session);
  }

  async getHighScores(gameId: number, user: ActiveUserInterface) {
    const highScore = await this.sessionsRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.game', 'game')
      .leftJoin('session.user', 'user')
      .addSelect(['user.username'])
      .where('session.gameId = :gameId', { gameId })
      .andWhere('session.arcadeId = :arcadeId', { arcadeId: user.arcadeId })
      .orderBy('session.score', 'DESC')
      .limit(10)
      .getMany();

    if (highScore.length === 0)
      throw new NotFoundException(
        'No hay puntuaciones registradas para este juego',
      );

    return highScore;
  }

  async getMostPlayedGames(user: ActiveUserInterface) {
    return this.sessionsRepository
      .createQueryBuilder('session')
      .leftJoin('session.game', 'game')
      .select('game.title', 'gameTitle')
      .addSelect('COUNT(session.id)', 'totalSessions')
      .where('session.arcadeId = :arcadeId', { arcadeId: user.arcadeId })
      .groupBy('game.id')
      .orderBy('totalSessions', 'DESC')
      .limit(5)
      .getRawMany();
  }

  async getControllerStats(user: ActiveUserInterface) {
    return this.sessionsRepository
      .createQueryBuilder('session')
      .select('session.controllerUsed', 'controller')
      .addSelect('COUNT(session.id)', 'usageCount')
      .where('session.arcadeId = :arcadeId', { arcadeId: user.arcadeId })
      .groupBy('session.controllerUsed')
      .orderBy('usageCount', 'DESC')
      .getRawMany();
  }

  async compareScores(scoreCompare: number, gameId: number) {
    const highestSession = await this.sessionsRepository.findOne({
      where: { game: { id: gameId } },
      order: { score: 'DESC' },
    });

    if (!highestSession) return false;
    console.log(highestSession, scoreCompare > highestSession.score);

    return scoreCompare > highestSession.score;
  }
}
