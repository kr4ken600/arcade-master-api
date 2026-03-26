import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, MaxLength } from 'class-validator';

export class CreateGameDto {
  @ApiProperty({
    description: 'El nombre del juego',
    example: 'The King of Fighters 2002',
  })
  @IsString()
  @MaxLength(50)
  title: string;

  @ApiProperty({ description: 'Género del juego', example: 'Fighting' })
  @IsString()
  genre: string;

  @ApiProperty({ description: 'Año de lanzamiento', example: 2002 })
  @IsInt()
  @Min(1970)
  year: number;
}
