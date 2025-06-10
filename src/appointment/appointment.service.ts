import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
} from './appointment.model';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from './dto/appointment.dto';
import { Patient } from '../patient/patient.model';
import { User } from '../user/user.model';
import { Op } from 'sequelize';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment)
    private appointmentModel: typeof Appointment,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
    createdByUserId: string,
  ): Promise<any> {
    // Check for doctor availability at the requested time
    const conflictingAppointment = await this.checkDoctorAvailability(
      createAppointmentDto.doctorId,
      new Date(createAppointmentDto.appointmentDateTime),
      createAppointmentDto.duration || 30,
    );

    if (conflictingAppointment) {
      throw new ConflictException(
        'Doctor is not available at the requested time',
      );
    }

    const appointment = new Appointment({
      ...createAppointmentDto,
      createdByUserId,
      status: AppointmentStatus.SCHEDULED,
    });

    return appointment.save();
  }
  async findAll(): Promise<any> {
    return this.appointmentModel.findAll({
      include: [
        {
          model: Patient,
          attributes: ['id', 'firstName', 'lastName', 'phoneNumber'],
        },
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'firstName', 'lastName', 'specialization'],
        },
        {
          model: User,
          as: 'nurse',
          attributes: ['id', 'firstName', 'lastName'],
        },
        {
          model: User,
          as: 'createdBy',
          attributes: ['id', 'firstName', 'lastName', 'role'],
        },
      ],
      order: [['appointmentDateTime', 'ASC']],
    });
  }

  async findById(id: string): Promise<any> {
    const appointment = await this.appointmentModel.findByPk(id, {
      include: [
        {
          model: Patient,
          attributes: [
            'id',
            'firstName',
            'lastName',
            'phoneNumber',
            'dateOfBirth',
            'medicalHistory',
          ],
        },
        {
          model: User,
          as: 'doctor',
          attributes: [
            'id',
            'firstName',
            'lastName',
            'specialization',
            'department',
          ],
        },
        {
          model: User,
          as: 'nurse',
          attributes: ['id', 'firstName', 'lastName', 'phoneNumber'],
        },
        {
          model: User,
          as: 'createdBy',
          attributes: ['id', 'firstName', 'lastName', 'role'],
        },
      ],
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async findByDoctor(doctorId: string, date?: string): Promise<any> {
    const whereClause: any = { doctorId };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      whereClause.appointmentDateTime = {
        [Op.between]: [startOfDay, endOfDay],
      };
    }

    return this.appointmentModel.findAll({
      where: whereClause,
      include: [
        {
          model: Patient,
          attributes: ['id', 'firstName', 'lastName', 'phoneNumber'],
        },
        {
          model: User,
          as: 'nurse',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      order: [['appointmentDateTime', 'ASC']],
    });
  }

  async findByPatient(patientId: string): Promise<any> {
    return this.appointmentModel.findAll({
      where: { patientId },
      include: [
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'firstName', 'lastName', 'specialization'],
        },
        {
          model: User,
          as: 'nurse',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      order: [['appointmentDateTime', 'DESC']],
    });
  }

  async findTodaysAppointments(): Promise<any> {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    return this.appointmentModel.findAll({
      where: {
        appointmentDateTime: {
          [Op.between]: [startOfDay, endOfDay],
        },
        status: {
          [Op.notIn]: [AppointmentStatus.CANCELLED],
        },
      },
      include: [
        {
          model: Patient,
          attributes: ['id', 'firstName', 'lastName', 'phoneNumber'],
        },
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'firstName', 'lastName', 'specialization'],
        },
        {
          model: User,
          as: 'nurse',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      order: [['appointmentDateTime', 'ASC']],
    });
  }

  async findUpcomingAppointments(days: number = 7): Promise<any> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return this.appointmentModel.findAll({
      where: {
        appointmentDateTime: {
          [Op.between]: [now, futureDate],
        },
        status: AppointmentStatus.SCHEDULED,
      },
      include: [
        {
          model: Patient,
          attributes: ['id', 'firstName', 'lastName', 'phoneNumber'],
        },
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'firstName', 'lastName', 'specialization'],
        },
      ],
      order: [['appointmentDateTime', 'ASC']],
    });
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<any> {
    const appointment = await this.findById(id);

    // If changing appointment time, check doctor availability
    if (
      updateAppointmentDto.appointmentDateTime ||
      updateAppointmentDto.duration
    ) {
      const newDateTime =
        updateAppointmentDto.appointmentDateTime ||
        appointment.appointmentDateTime;
      const newDuration = updateAppointmentDto.duration || appointment.duration;

      const conflictingAppointment = await this.checkDoctorAvailability(
        appointment.doctorId,
        newDateTime,
        newDuration,
        id, // exclude current appointment
      );

      if (conflictingAppointment) {
        throw new ConflictException(
          'Doctor is not available at the requested time',
        );
      }
    }

    await appointment.update(updateAppointmentDto);
    return this.findById(id);
  }

  async updateStatus(id: string, status: AppointmentStatus): Promise<any> {
    const appointment = await this.findById(id);

    const updateData: any = { status };

    if (status === AppointmentStatus.IN_PROGRESS) {
      updateData.actualStartTime = new Date();
    } else if (status === AppointmentStatus.COMPLETED) {
      updateData.actualEndTime = new Date();
    }

    await appointment.update(updateData);
    return this.findById(id);
  }

  async cancel(id: string): Promise<any> {
    const appointment = await this.findById(id);
    await appointment.update({ status: AppointmentStatus.CANCELLED });
    return this.findById(id);
  }

  async remove(id: string): Promise<any> {
    const appointment = await this.findById(id);
    await appointment.destroy();
  }

  private async checkDoctorAvailability(
    doctorId: string,
    appointmentDateTime: Date,
    duration: number,
    excludeAppointmentId?: string,
  ): Promise<any> {
    const appointmentStart = new Date(appointmentDateTime);
    const appointmentEnd = new Date(
      appointmentDateTime.getTime() + duration * 60000,
    );

    const whereClause: any = {
      doctorId,
      status: {
        [Op.notIn]: [AppointmentStatus.CANCELLED, AppointmentStatus.COMPLETED],
      },
      [Op.or]: [
        {
          appointmentDateTime: {
            [Op.between]: [appointmentStart, appointmentEnd],
          },
        },
        {
          [Op.and]: [
            {
              appointmentDateTime: {
                [Op.lte]: appointmentStart,
              },
            },
            // Check if existing appointment ends after new appointment starts
            {
              appointmentDateTime: {
                [Op.gte]: new Date(appointmentStart.getTime() - 60 * 60000), // 1 hour buffer
              },
            },
          ],
        },
      ],
    };

    if (excludeAppointmentId) {
      whereClause.id = { [Op.ne]: excludeAppointmentId };
    }

    const conflictingAppointment = await this.appointmentModel.findOne({
      where: whereClause,
    });

    return !!conflictingAppointment;
  }

  async getDoctorSchedule(
    doctorId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    return this.appointmentModel.findAll({
      where: {
        doctorId,
        appointmentDateTime: {
          [Op.between]: [startDate, endDate],
        },
        status: {
          [Op.notIn]: [AppointmentStatus.CANCELLED],
        },
      },
      include: [
        {
          model: Patient,
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      order: [['appointmentDateTime', 'ASC']],
    });
  }

  async getAppointmentStatistics(
    startDate?: Date,
    endDate?: Date,
  ): Promise<any> {
    const whereClause: any = {};

    if (startDate && endDate) {
      whereClause.appointmentDateTime = {
        [Op.between]: [startDate, endDate],
      };
    }

    const totalAppointments = await this.appointmentModel.count({
      where: whereClause,
    });

    const statusCounts = await this.appointmentModel.findAll({
      where: whereClause,
      attributes: [
        'status',
        [this.appointmentModel.sequelize!.fn('COUNT', '*'), 'count'],
      ],
      group: ['status'],
      raw: true,
    });

    const typeCounts = await this.appointmentModel.findAll({
      where: whereClause,
      attributes: [
        'type',
        [this.appointmentModel.sequelize!.fn('COUNT', '*'), 'count'],
      ],
      group: ['type'],
      raw: true,
    });

    return {
      total: totalAppointments,
      byStatus: statusCounts,
      byType: typeCounts,
    };
  }
}
