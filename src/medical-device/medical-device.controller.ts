import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MedicalDeviceService } from './medical-device.service';
import {
  CreateMedicalDeviceDataDto,
  UpdateMedicalDeviceDataDto,
} from './dto/medical-device.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/user.model';
import { DeviceType } from './medical-device.model';

@ApiTags('Medical Devices')
@Controller('medical-devices')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MedicalDeviceController {
  constructor(private readonly medicalDeviceService: MedicalDeviceService) {}

  @Post('data/patient/:patientId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.NURSE, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Record medical device data' })
  create(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Body() createMedicalDeviceDataDto: CreateMedicalDeviceDataDto,
    @Request() req,
  ) {
    return this.medicalDeviceService.create(
      createMedicalDeviceDataDto,
      patientId,
      req.user.id,
    );
  }

  @Get('data')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all medical device data' })
  findAll() {
    return this.medicalDeviceService.findAll();
  }

  @Get('data/patient/:patientId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.NURSE)
  @ApiOperation({ summary: 'Get all device data for patient' })
  findByPatient(@Param('patientId', ParseUUIDPipe) patientId: string) {
    return this.medicalDeviceService.findByPatient(patientId);
  }

  @Get('data/patient/:patientId/device/:deviceType')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.NURSE)
  @ApiOperation({ summary: 'Get specific device data for patient' })
  findByPatientAndDevice(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('deviceType') deviceType: DeviceType,
  ) {
    return this.medicalDeviceService.findByPatientAndDevice(
      patientId,
      deviceType,
    );
  }

  @Get('data/patient/:patientId/recent')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.NURSE)
  @ApiOperation({ summary: 'Get recent device data for patient' })
  findRecentByPatient(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('hours', ParseIntPipe) hours: number = 24,
  ) {
    return this.medicalDeviceService.findRecentByPatient(patientId, hours);
  }

  @Get('data/abnormal')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.NURSE)
  @ApiOperation({ summary: 'Get abnormal readings' })
  findAbnormalReadings(@Query('patientId') patientId?: string) {
    return this.medicalDeviceService.findAbnormalReadings(patientId);
  }

  @Get('data/patient/:patientId/history')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.NURSE)
  @ApiOperation({ summary: 'Get patient vitals history' })
  getPatientVitalsHistory(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('deviceType') deviceType?: DeviceType,
    @Query('days', ParseIntPipe) days: number = 7,
  ) {
    return this.medicalDeviceService.getPatientVitalsHistory(
      patientId,
      deviceType,
      days,
    );
  }

  @Get('data/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.NURSE)
  @ApiOperation({ summary: 'Get device data by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.medicalDeviceService.findById(id);
  }

  @Put('data/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.NURSE, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Update device data' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMedicalDeviceDataDto: UpdateMedicalDeviceDataDto,
  ) {
    return this.medicalDeviceService.update(id, updateMedicalDeviceDataDto);
  }

  @Delete('data/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete device data (Admin only)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.medicalDeviceService.remove(id);
  }
}
