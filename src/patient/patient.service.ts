import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Patient, PatientStatus } from './patient.model';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';
import { User } from '../user/user.model';
import { Op } from 'sequelize';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient)
    private patientModel: typeof Patient,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<any> {
    const patient = new Patient(createPatientDto as any);
    return patient.save();
  }

  async findAll(): Promise<any> {
    return this.patientModel.findAll({
      include: [
        {
          model: User,
          as: 'assignedNurse',
          attributes: ['id', 'firstName', 'lastName', 'username', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(id: string): Promise<any> {
    const patient = await this.patientModel.findByPk(id, {
      include: [
        {
          model: User,
          as: 'assignedNurse',
          attributes: ['id', 'firstName', 'lastName', 'username', 'email'],
        },
      ],
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  async findByNurse(nurseId: string): Promise<any> {
    return this.patientModel.findAll({
      where: { assignedNurseId: nurseId },
      include: [
        {
          model: User,
          as: 'assignedNurse',
          attributes: ['id', 'firstName', 'lastName', 'username', 'email'],
        },
      ],
      order: [['firstName', 'ASC']],
    });
  }

  async findActivePatients(): Promise<any> {
    return this.patientModel.findAll({
      where: {
        status: {
          [Op.in]: [PatientStatus.ACTIVE, PatientStatus.ADMITTED],
        },
      },
      include: [
        {
          model: User,
          as: 'assignedNurse',
          attributes: ['id', 'firstName', 'lastName', 'username', 'email'],
        },
      ],
      order: [['firstName', 'ASC']],
    });
  }

  async update(id: string, updatePatientDto: UpdatePatientDto): Promise<any> {
    const patient = await this.findById(id);
    await patient.update(updatePatientDto);
    return this.findById(id);
  }

  async assignNurse(patientId: string, nurseId: string): Promise<any> {
    const patient = await this.findById(patientId);
    await patient.update({ assignedNurseId: nurseId });
    return this.findById(patientId);
  }

  async updateStatus(id: string, status: PatientStatus): Promise<any> {
    const patient = await this.findById(id);
    await patient.update({ status });

    if (status === PatientStatus.DISCHARGED) {
      await patient.update({ dischargeDate: new Date() });
    }

    return this.findById(id);
  }

  async remove(id: string): Promise<any> {
    const patient = await this.findById(id);
    await patient.destroy();
  }

  async searchPatients(searchTerm: string): Promise<any> {
    return this.patientModel.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.like]: `%${searchTerm}%` } },
          { lastName: { [Op.like]: `%${searchTerm}%` } },
          { email: { [Op.like]: `%${searchTerm}%` } },
          { phoneNumber: { [Op.like]: `%${searchTerm}%` } },
        ],
      },
      include: [
        {
          model: User,
          as: 'assignedNurse',
          attributes: ['id', 'firstName', 'lastName', 'username', 'email'],
        },
      ],
      order: [['firstName', 'ASC']],
    });
  }
}
