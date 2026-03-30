import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { Game } from 'src/games/entities/game.entity';
import { SessionsGateway } from './sessions.gateway';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Session, Game]), RedisModule],
  controllers: [SessionsController],
  providers: [SessionsService, SessionsGateway],
})
export class SessionsModule {}
