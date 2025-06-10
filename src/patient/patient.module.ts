import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { Patient } from './patient.model';
import { User } from '../user/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Patient, User])],
  providers: [PatientService],
  controllers: [PatientController],
  exports: [PatientService],
})
export class PatientModule {}
