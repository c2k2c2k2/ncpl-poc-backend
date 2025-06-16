import {
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DeviceType } from '../medical-device.model';

export class CreateMedicalDeviceDataDto {
  @ApiProperty({ enum: DeviceType, description: 'Type of medical device' })
  @IsEnum(DeviceType)
  @IsNotEmpty()
  deviceType: DeviceType;

  @ApiPropertyOptional({ example: 'Model X', description: 'Device model' })
  @IsString()
  @IsOptional()
  deviceModel?: string;

  @ApiPropertyOptional({
    example: 'SN123456',
    description: 'Device serial number',
  })
  @IsString()
  @IsOptional()
  deviceSerialNumber?: string;

  @ApiProperty({ example: 120, description: 'Numeric measurement value' })
  @IsNumber()
  @IsNotEmpty()
  numericValue: number;

  @ApiPropertyOptional({
    example: 'ON',
    description: 'String measurement value',
  })
  @IsString()
  @IsOptional()
  stringValue?: string;

  @ApiPropertyOptional({
    example: '{"systolic":120}',
    description: 'JSON data from device',
  })
  @IsJSON()
  @IsOptional()
  jsonData?: string;

  @ApiPropertyOptional({ example: 'mmHg', description: 'Unit of measurement' })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiPropertyOptional({
    example: 'Patient was resting',
    description: 'Additional notes',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateMedicalDeviceDataDto {
  @ApiPropertyOptional({
    enum: DeviceType,
    description: 'Type of medical device',
  })
  @IsEnum(DeviceType)
  @IsOptional()
  deviceType?: DeviceType;

  @ApiPropertyOptional({ example: 'Model X', description: 'Device model' })
  @IsString()
  @IsOptional()
  deviceModel?: string;

  @ApiPropertyOptional({
    example: 'SN123456',
    description: 'Device serial number',
  })
  @IsString()
  @IsOptional()
  deviceSerialNumber?: string;

  @ApiPropertyOptional({
    example: 120,
    description: 'Numeric measurement value',
  })
  @IsNumber()
  @IsOptional()
  numericValue?: number;

  @ApiPropertyOptional({
    example: 'ON',
    description: 'String measurement value',
  })
  @IsString()
  @IsOptional()
  stringValue?: string;

  @ApiPropertyOptional({
    example: '{"systolic":120}',
    description: 'JSON data from device',
  })
  @IsJSON()
  @IsOptional()
  jsonData?: string;

  @ApiPropertyOptional({ example: 'mmHg', description: 'Unit of measurement' })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiPropertyOptional({
    example: 'Patient was resting',
    description: 'Additional notes',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
