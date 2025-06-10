import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AppointmentType, Priority } from '../appointment.model';

export class CreateAppointmentDto {
  @IsDateString()
  @IsNotEmpty()
  appointmentDateTime: string;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsEnum(AppointmentType)
  @IsNotEmpty()
  type: AppointmentType;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  symptoms?: string;

  @IsString()
  @IsOptional()
  diagnosis?: string;

  @IsString()
  @IsOptional()
  treatment?: string;

  @IsString()
  @IsOptional()
  prescription?: string;

  @IsString()
  @IsNotEmpty()
  doctorId: string;
}

export class UpdateAppointmentDto {
  @IsDateString()
  @IsOptional()
  appointmentDateTime?: string;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsEnum(AppointmentType)
  @IsOptional()
  type?: AppointmentType;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  symptoms?: string;

  @IsString()
  @IsOptional()
  diagnosis?: string;

  @IsString()
  @IsOptional()
  treatment?: string;

  @IsString()
  @IsOptional()
  prescription?: string;
}
