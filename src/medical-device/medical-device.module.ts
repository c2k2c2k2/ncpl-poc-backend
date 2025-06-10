import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MedicalDeviceService } from './medical-device.service';
import { MedicalDeviceController } from './medical-device.controller';
import { MedicalDeviceData } from './medical-device.model';
import { Patient } from '../patient/patient.model';
import { User } from '../user/user.model';

@Module({
  imports: [SequelizeModule.forFeature([MedicalDeviceData, Patient, User])],
  providers: [MedicalDeviceService],
  controllers: [MedicalDeviceController],
  exports: [MedicalDeviceService],
})
export class MedicalDeviceModule {}
