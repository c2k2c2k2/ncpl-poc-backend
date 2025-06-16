import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BloodGroup, Gender } from '../patient.model';

export class CreatePatientDto {
  @ApiProperty({ example: 'Jane', description: 'First name of the patient' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the patient' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '1980-01-01', description: 'Date of birth' })
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @ApiProperty({ enum: Gender, description: 'Gender of the patient' })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ApiPropertyOptional({ example: '+12015550100', description: 'Phone number' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({
    example: 'patient@example.com',
    description: 'Email address',
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '123 Main St', description: 'Home address' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'Emergency contact name',
  })
  @IsString()
  @IsOptional()
  emergencyContactName?: string;

  @ApiPropertyOptional({
    example: '+12015550101',
    description: 'Emergency contact phone',
  })
  @IsString()
  @IsOptional()
  emergencyContactPhone?: string;

  @ApiPropertyOptional({ enum: BloodGroup, description: 'Blood group' })
  @IsEnum(BloodGroup)
  @IsOptional()
  bloodGroup?: BloodGroup;
}

export class UpdatePatientDto {
  @ApiPropertyOptional({
    example: 'Jane',
    description: 'First name of the patient',
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'Last name of the patient',
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: '1980-01-01', description: 'Date of birth' })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiPropertyOptional({ enum: Gender, description: 'Gender of the patient' })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiPropertyOptional({ example: '+12015550100', description: 'Phone number' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({
    example: 'patient@example.com',
    description: 'Email address',
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '123 Main St', description: 'Home address' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'Emergency contact name',
  })
  @IsString()
  @IsOptional()
  emergencyContactName?: string;

  @ApiPropertyOptional({
    example: '+12015550101',
    description: 'Emergency contact phone',
  })
  @IsString()
  @IsOptional()
  emergencyContactPhone?: string;

  @ApiPropertyOptional({ enum: BloodGroup, description: 'Blood group' })
  @IsEnum(BloodGroup)
  @IsOptional()
  bloodGroup?: BloodGroup;
}
