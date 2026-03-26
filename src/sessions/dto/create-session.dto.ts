import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({ description: 'Puntuación del juego', example: 10123 })
  @IsInt()
  @Min(0)
  score: number;

  @ApiProperty({ description: 'Mando usado para jugar', example: 'Xbox 360' })
  @IsString()
  controllerUsed: string;

  @ApiProperty({ description: 'Id del juego', example: 1 })
  @IsInt()
  gameId: number;
}
