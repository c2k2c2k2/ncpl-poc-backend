import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MedicalDeviceData, DeviceType } from './medical-device.model';
import {
  CreateMedicalDeviceDataDto,
  UpdateMedicalDeviceDataDto,
} from './dto/medical-device.dto';
import { Patient } from '../patient/patient.model';
import { User } from '../user/user.model';
import { Op } from 'sequelize';

@Injectable()
export class MedicalDeviceService {
  constructor(
    @InjectModel(MedicalDeviceData)
    private medicalDeviceDataModel: typeof MedicalDeviceData,
  ) {}

  async create(
    createMedicalDeviceDataDto: CreateMedicalDeviceDataDto,
    patientId: string,
    recordedByUserId: string,
  ): Promise<any> {
    const deviceData = new MedicalDeviceData({
      ...createMedicalDeviceDataDto,
      patientId,
      recordedByUserId,
      recordedAt: new Date(),
    });

    return deviceData.save();
  }

  async findAll(): Promise<any> {
    return this.medicalDeviceDataModel.findAll({
      include: [
        {
          model: Patient,
          attributes: ['id', 'firstName', 'lastName'],
        },
        {
          model: User,
          as: 'recordedBy',
          attributes: ['id', 'firstName', 'lastName', 'role'],
        },
      ],
      order: [['recordedAt', 'DESC']],
    });
  }

  async findByPatient(patientId: string): Promise<any> {
    return this.medicalDeviceDataModel.findAll({
      where: { patientId },
      include: [
        {
          model: User,
          as: 'recordedBy',
          attributes: ['id', 'firstName', 'lastName', 'role'],
        },
      ],
      order: [['recordedAt', 'DESC']],
    });
  }

  async findByPatientAndDevice(
    patientId: string,
    deviceType: DeviceType,
  ): Promise<any> {
    return this.medicalDeviceDataModel.findAll({
      where: {
        patientId,
        deviceType,
      },
      include: [
        {
          model: User,
          as: 'recordedBy',
          attributes: ['id', 'firstName', 'lastName', 'role'],
        },
      ],
      order: [['recordedAt', 'DESC']],
    });
  }

  async findById(id: string): Promise<any> {
    const deviceData = await this.medicalDeviceDataModel.findByPk(id, {
      include: [
        {
          model: Patient,
          attributes: ['id', 'firstName', 'lastName'],
        },
        {
          model: User,
          as: 'recordedBy',
          attributes: ['id', 'firstName', 'lastName', 'role'],
        },
      ],
    });

    if (!deviceData) {
      throw new NotFoundException('Medical device data not found');
    }

    return deviceData;
  }

  async findRecentByPatient(
    patientId: string,
    hours: number = 24,
  ): Promise<any> {
    const timeThreshold = new Date();
    timeThreshold.setHours(timeThreshold.getHours() - hours);

    return this.medicalDeviceDataModel.findAll({
      where: {
        patientId,
        recordedAt: {
          [Op.gte]: timeThreshold,
        },
      },
      include: [
        {
          model: User,
          as: 'recordedBy',
          attributes: ['id', 'firstName', 'lastName', 'role'],
        },
      ],
      order: [['recordedAt', 'DESC']],
    });
  }

  async findAbnormalReadings(patientId?: string): Promise<any> {
    const whereClause: any = { isAbnormal: true };
    if (patientId) {
      whereClause.patientId = patientId;
    }

    return this.medicalDeviceDataModel.findAll({
      where: whereClause,
      include: [
        {
          model: Patient,
          attributes: ['id', 'firstName', 'lastName'],
        },
        {
          model: User,
          as: 'recordedBy',
          attributes: ['id', 'firstName', 'lastName', 'role'],
        },
      ],
      order: [['recordedAt', 'DESC']],
    });
  }

  async update(
    id: string,
    updateMedicalDeviceDataDto: UpdateMedicalDeviceDataDto,
  ): Promise<any> {
    const deviceData = await this.findById(id);
    await deviceData.update(updateMedicalDeviceDataDto);
    return this.findById(id);
  }

  async remove(id: string): Promise<any> {
    const deviceData = await this.findById(id);
    await deviceData.destroy();
  }

  async getPatientVitalsHistory(
    patientId: string,
    deviceType?: DeviceType,
    days: number = 7,
  ): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const whereClause: any = {
      patientId,
      recordedAt: {
        [Op.gte]: startDate,
      },
    };

    if (deviceType) {
      whereClause.deviceType = deviceType;
    }

    return this.medicalDeviceDataModel.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'recordedBy',
          attributes: ['id', 'firstName', 'lastName', 'role'],
        },
      ],
      order: [['recordedAt', 'ASC']],
    });
  }
}
