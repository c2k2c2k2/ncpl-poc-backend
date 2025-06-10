import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Patient } from '../patient/patient.model';
import { User } from '../user/user.model';

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export enum AppointmentType {
  CONSULTATION = 'consultation',
  FOLLOW_UP = 'follow_up',
  EMERGENCY = 'emergency',
  ROUTINE_CHECKUP = 'routine_checkup',
  SPECIALIST = 'specialist',
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Table({
  tableName: 'appointments',
  timestamps: true,
})
export class Appointment extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  appointmentDateTime: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 30,
  })
  duration: number; // in minutes

  @Column({
    type: DataType.ENUM,
    values: Object.values(AppointmentType),
    allowNull: false,
  })
  type: AppointmentType;

  @Column({
    type: DataType.ENUM,
    values: Object.values(AppointmentStatus),
    defaultValue: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  @Column({
    type: DataType.ENUM,
    values: Object.values(Priority),
    defaultValue: Priority.MEDIUM,
  })
  priority: Priority;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  reason: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  symptoms: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  diagnosis: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  treatment: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  prescription: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  actualStartTime: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  actualEndTime: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  nextFollowUpDate: Date;

  // Foreign Keys
  @ForeignKey(() => Patient)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  patientId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  doctorId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  nurseId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  createdByUserId: string;

  // Relationships
  @BelongsTo(() => Patient, { foreignKey: 'patientId', onDelete: 'CASCADE' })
  patient: Patient;

  @BelongsTo(() => User, {
    foreignKey: 'doctorId',
    as: 'doctor',
    onDelete: 'RESTRICT',
  })
  doctor: User;

  @BelongsTo(() => User, {
    foreignKey: 'nurseId',
    as: 'nurse',
    onDelete: 'SET NULL',
  })
  nurse: User;

  @BelongsTo(() => User, {
    foreignKey: 'createdByUserId',
    as: 'createdBy',
    onDelete: 'RESTRICT',
  })
  createdBy: User;

  // Virtual field for appointment end time
  get appointmentEndTime(): Date {
    return new Date(this.appointmentDateTime.getTime() + this.duration * 60000);
  }
}
