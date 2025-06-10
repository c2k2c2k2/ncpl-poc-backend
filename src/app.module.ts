import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PatientModule } from './patient/patient.module';
import { MedicalDeviceModule } from './medical-device/medical-device.module';
import { AppointmentModule } from './appointment/appointment.module';
import { User } from './user/user.model';
import { Patient } from './patient/patient.model';
import { MedicalDeviceData } from './medical-device/medical-device.model';
import { Appointment } from './appointment/appointment.model';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: parseInt(process.env.THROTTLE_TTL!) || 60,
          limit: parseInt(process.env.THROTTLE_LIMIT!) || 10,
        },
      ],
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      models: [User, Patient, MedicalDeviceData, Appointment],
      autoLoadModels: true,
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
    }),
    AuthModule,
    UserModule,
    PatientModule,
    MedicalDeviceModule,
    AppointmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
