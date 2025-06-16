import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../user.model';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'johndoe', description: 'Unique username' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'strongPassword123', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ enum: UserRole, description: 'Role of the user' })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiPropertyOptional({
    example: '+12015550100',
    description: 'Contact number',
  })
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({
    example: 'Cardiology',
    description: 'Department name',
  })
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({
    example: 'Heart specialist',
    description: 'Specialization',
  })
  @IsOptional()
  specialization?: string;

  @ApiPropertyOptional({
    example: 'Experienced doctor',
    description: 'Short bio',
  })
  @IsOptional()
  bio?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'John',
    description: 'First name of the user',
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'Last name of the user' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: 'johndoe', description: 'Unique username' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({
    example: 'john@example.com',
    description: 'Email address',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: 'newPassword123',
    description: 'User password',
  })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({ enum: UserRole, description: 'Role of the user' })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
