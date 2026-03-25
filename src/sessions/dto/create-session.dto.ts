import { IsInt, IsString, Min } from "class-validator";

export class CreateSessionDto {
  @IsInt()
  @Min(0)
  score: number;

  @IsString()
  controllerUsed: string;

  @IsInt()
  gameId: number;
}
