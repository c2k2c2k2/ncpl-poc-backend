import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { Appointment } from './appointment.model';
import { Patient } from '../patient/patient.model';
import { User } from '../user/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Appointment, Patient, User])],
  providers: [AppointmentService],
  controllers: [AppointmentController],
  exports: [AppointmentService],
})
export class AppointmentModule {}
