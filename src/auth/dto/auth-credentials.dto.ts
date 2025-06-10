import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDto {
  @ApiProperty({
    description: 'Username for login',
    example: 'doctor123',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Password for login',
    example: 'strongPassword!123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
