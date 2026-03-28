import { PartialType } from '@nestjs/swagger';
import { CreateArcadeDto } from './create-arcade.dto';

export class UpdateArcadeDto extends PartialType(CreateArcadeDto) {}
