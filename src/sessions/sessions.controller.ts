import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import type { ActiveUserInterface } from 'src/interfaces/interfaces';

@ApiTags('Sessions')
@ApiBearerAuth()
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  create(
    @Body() createSessionDto: CreateSessionDto,
    @ActiveUser() user: ActiveUserInterface,
  ) {
    return this.sessionsService.create(createSessionDto, user);
  }

  @Get()
  findAll(@ActiveUser() user: ActiveUserInterface) {
    return this.sessionsService.findAll(user);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: ActiveUserInterface,
  ) {
    return this.sessionsService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    return this.sessionsService.update(id, updateSessionDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: ActiveUserInterface,
  ) {
    return this.sessionsService.remove(id, user);
  }

  @Get('stats/most-played')
  getMostPlayed(@ActiveUser() user: ActiveUserInterface) {
    return this.sessionsService.getMostPlayedGames(user);
  }

  @Get('stats/controllers')
  getControllerStats(@ActiveUser() user: ActiveUserInterface) {
    return this.sessionsService.getControllerStats(user);
  }

  @Get('game/:gameId/highscores')
  getHighScores(
    @Param('gameId', ParseIntPipe) gameId: number,
    @ActiveUser() user: ActiveUserInterface,
  ) {
    return this.sessionsService.getHighScores(gameId, user);
  }
}
