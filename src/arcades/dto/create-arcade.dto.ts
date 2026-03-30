import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateArcadeDto {
  @ApiProperty({
    description: 'El nombre del arcade (negocio)',
    example: 'Arcade Master',
  })
  @IsString()
  @MaxLength(50)
  businessName: string;
  @ApiProperty({
    description: 'El plan de suscripción',
    example: 'free',
  })
  @IsString()
  subscriptionPlan: string;
}
