import { IsString, IsInt, Min, MaxLength } from 'class-validator';

export class CreateGameDto {
  @IsString()
  @MaxLength(50)
  title: string;

  @IsString()
  genre: string;

  @IsInt()
  @Min(1970)
  year: number;
}
