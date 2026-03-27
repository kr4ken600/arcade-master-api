import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { Request } from 'express';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  create(
    @Body() createSessionDto: CreateSessionDto,
    @Req() req: Request & { user: { userId: number } },
  ) {
    const userId = req.user.userId;
    return this.sessionsService.create(createSessionDto, userId);
  }

  @Public()
  @Get()
  findAll() {
    return this.sessionsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sessionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    return this.sessionsService.update(id, updateSessionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sessionsService.remove(id);
  }

  @Public()
  @Get('stats/most-played')
  getMostPlayed() {
    return this.sessionsService.getMostPlayedGames();
  }

  @Public()
  @Get('stats/controllers')
  getControllerStats() {
    return this.sessionsService.getControllerStats();
  }

  @Public()
  @Get('game/:gameId/highscores')
  getHighScores(@Param('gameId', ParseIntPipe) gameId: number) {
    return this.sessionsService.getHighScores(gameId);
  }
}
