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
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/user.model';
import { PatientStatus } from './patient.model';

@ApiTags('Patients')
@Controller('patients')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.NURSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create new patient' })
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all patients' })
  findAll(@Query('search') search?: string) {
    if (search) {
      return this.patientService.searchPatients(search);
    }
    return this.patientService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active patients' })
  findActivePatients() {
    return this.patientService.findActivePatients();
  }

  @Get('nurse/:nurseId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.NURSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get patients assigned to nurse' })
  findByNurse(@Param('nurseId', ParseUUIDPipe) nurseId: string) {
    return this.patientService.findByNurse(nurseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get patient by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.patientService.findById(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.NURSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update patient' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    return this.patientService.update(id, updatePatientDto);
  }

  @Put(':id/assign-nurse/:nurseId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.NURSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Assign nurse to patient' })
  assignNurse(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('nurseId', ParseUUIDPipe) nurseId: string,
  ) {
    return this.patientService.assignNurse(id, nurseId);
  }

  @Put(':id/status/:status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.NURSE, UserRole.DOCTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update patient status' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('status') status: PatientStatus,
  ) {
    return this.patientService.updateStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete patient (Admin only)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.patientService.remove(id);
  }
}
