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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from './dto/appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/user.model';
import { AppointmentStatus } from './appointment.model';

@ApiTags('Appointments')
@Controller('appointments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.NURSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create new appointment' })
  @ApiResponse({ status: 201, description: 'Appointment created successfully' })
  @ApiResponse({
    status: 409,
    description: 'Doctor not available at requested time',
  })
  create(@Body() createAppointmentDto: CreateAppointmentDto, @Request() req) {
    return this.appointmentService.create(createAppointmentDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all appointments' })
  @ApiResponse({ status: 200, description: 'Returns all appointments' })
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get('today')
  @ApiOperation({ summary: "Get today's appointments" })
  @ApiResponse({ status: 200, description: "Returns today's appointments" })
  findTodaysAppointments() {
    return this.appointmentService.findTodaysAppointments();
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming appointments' })
  @ApiResponse({ status: 200, description: 'Returns upcoming appointments' })
  findUpcomingAppointments(@Query('days') days?: string) {
    const daysCount = days ? parseInt(days) : 7;
    return this.appointmentService.findUpcomingAppointments(daysCount);
  }

  @Get('statistics')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Get appointment statistics' })
  @ApiResponse({ status: 200, description: 'Returns appointment statistics' })
  getStatistics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.appointmentService.getAppointmentStatistics(start, end);
  }

  @Get('doctor/:doctorId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN)
  @ApiOperation({ summary: "Get doctor's appointments" })
  @ApiResponse({ status: 200, description: "Returns doctor's appointments" })
  findByDoctor(
    @Param('doctorId', ParseUUIDPipe) doctorId: string,
    @Query('date') date?: string,
  ) {
    return this.appointmentService.findByDoctor(doctorId, date);
  }

  @Get('doctor/:doctorId/schedule')
  @UseGuards(RolesGuard)
  @Roles(UserRole.NURSE, UserRole.ADMIN)
  @ApiOperation({ summary: "Get doctor's schedule" })
  @ApiResponse({ status: 200, description: "Returns doctor's schedule" })
  getDoctorSchedule(
    @Param('doctorId', ParseUUIDPipe) doctorId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.appointmentService.getDoctorSchedule(
      doctorId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('patient/:patientId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN)
  @ApiOperation({ summary: "Get patient's appointments" })
  @ApiResponse({ status: 200, description: "Returns patient's appointments" })
  findByPatient(@Param('patientId', ParseUUIDPipe) patientId: string) {
    return this.appointmentService.findByPatient(patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment by ID' })
  @ApiResponse({ status: 200, description: 'Returns appointment details' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentService.findById(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.NURSE, UserRole.DOCTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update appointment' })
  @ApiResponse({ status: 200, description: 'Appointment updated successfully' })
  @ApiResponse({
    status: 409,
    description: 'Doctor not available at requested time',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.update(id, updateAppointmentDto);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.NURSE)
  @ApiOperation({ summary: 'Update appointment status' })
  @ApiResponse({ status: 200, description: 'Appointment status updated' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { status: AppointmentStatus },
  ) {
    return this.appointmentService.updateStatus(id, body.status);
  }

  @Put(':id/cancel')
  @UseGuards(RolesGuard)
  @Roles(UserRole.NURSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Cancel appointment' })
  @ApiResponse({
    status: 200,
    description: 'Appointment cancelled successfully',
  })
  cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentService.cancel(id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete appointment (Admin only)' })
  @ApiResponse({ status: 200, description: 'Appointment deleted successfully' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentService.remove(id);
  }
}
