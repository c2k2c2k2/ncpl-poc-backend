import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentType, Priority } from '../appointment.model';

export class CreateAppointmentDto {
  @ApiProperty({
    example: '2025-01-01T10:00:00Z',
    description: 'Date and time of the appointment',
  })
  @IsDateString()
  @IsNotEmpty()
  appointmentDateTime: string;

  @ApiPropertyOptional({ example: 30, description: 'Duration in minutes' })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiProperty({ enum: AppointmentType, description: 'Type of appointment' })
  @IsEnum(AppointmentType)
  @IsNotEmpty()
  type: AppointmentType;

  @ApiPropertyOptional({ enum: Priority, description: 'Priority level' })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @ApiPropertyOptional({
    example: 'Check-up',
    description: 'Reason for appointment',
  })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiPropertyOptional({
    example: 'Headache',
    description: 'Reported symptoms',
  })
  @IsString()
  @IsOptional()
  symptoms?: string;

  @ApiPropertyOptional({
    example: 'Migraine',
    description: 'Diagnosis details',
  })
  @IsString()
  @IsOptional()
  diagnosis?: string;

  @ApiPropertyOptional({
    example: 'Rest and hydration',
    description: 'Treatment provided',
  })
  @IsString()
  @IsOptional()
  treatment?: string;

  @ApiPropertyOptional({
    example: 'Painkillers',
    description: 'Prescription details',
  })
  @IsString()
  @IsOptional()
  prescription?: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID of the doctor',
  })
  @IsString()
  @IsNotEmpty()
  doctorId: string;
}

export class UpdateAppointmentDto {
  @ApiPropertyOptional({
    example: '2025-01-01T10:00:00Z',
    description: 'Date and time of the appointment',
  })
  @IsDateString()
  @IsOptional()
  appointmentDateTime?: string;

  @ApiPropertyOptional({ example: 30, description: 'Duration in minutes' })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiPropertyOptional({
    enum: AppointmentType,
    description: 'Type of appointment',
  })
  @IsEnum(AppointmentType)
  @IsOptional()
  type?: AppointmentType;

  @ApiPropertyOptional({ enum: Priority, description: 'Priority level' })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @ApiPropertyOptional({
    example: 'Follow-up',
    description: 'Reason for appointment',
  })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiPropertyOptional({
    example: 'Headache',
    description: 'Reported symptoms',
  })
  @IsString()
  @IsOptional()
  symptoms?: string;

  @ApiPropertyOptional({
    example: 'Migraine',
    description: 'Diagnosis details',
  })
  @IsString()
  @IsOptional()
  diagnosis?: string;

  @ApiPropertyOptional({
    example: 'Rest and hydration',
    description: 'Treatment provided',
  })
  @IsString()
  @IsOptional()
  treatment?: string;

  @ApiPropertyOptional({
    example: 'Painkillers',
    description: 'Prescription details',
  })
  @IsString()
  @IsOptional()
  prescription?: string;
}
