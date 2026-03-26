import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ description: 'Correo electronico', example: 'test@test.com' })
  @IsEmail()
  email: string;
  
  @ApiProperty({ description: 'Nombre se usuario', example: 'ElManco' })
  @IsString()
  username: string;
  
  @ApiProperty({ description: 'Contraseña', example: 'p4ssw0rd!' })
  @IsString()
  password: string;
}
