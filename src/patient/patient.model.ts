import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { User } from '../user/user.model';
import { MedicalDeviceData } from '../medical-device/medical-device.model';
import { Appointment } from '../appointment/appointment.model';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum BloodGroup {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

export enum PatientStatus {
  ACTIVE = 'active',
  DISCHARGED = 'discharged',
  ADMITTED = 'admitted',
  DECEASED = 'deceased',
}

@Table({
  tableName: 'patients',
  timestamps: true,
})
export class Patient extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  dateOfBirth: Date;

  @Column({
    type: DataType.ENUM,
    values: Object.values(Gender),
    allowNull: false,
  })
  gender: Gender;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  phoneNumber: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  email: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  address: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  emergencyContactName: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  emergencyContactPhone: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(BloodGroup),
    allowNull: true,
  })
  bloodGroup: BloodGroup;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  medicalHistory: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  allergies: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  currentMedications: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(PatientStatus),
    defaultValue: PatientStatus.ACTIVE,
  })
  status: PatientStatus;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  insuranceProvider: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  insurancePolicyNumber: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  admissionDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  dischargeDate: Date;

  // Foreign Keys
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  assignedNurseId: string;

  // Relationships
  @BelongsTo(() => User, {
    foreignKey: 'assignedNurseId',
    onDelete: 'SET NULL',
  })
  assignedNurse: User;

  @HasMany(() => MedicalDeviceData, {
    foreignKey: 'patientId',
    onDelete: 'CASCADE',
  })
  medicalDeviceData: MedicalDeviceData[];

  @HasMany(() => Appointment, { foreignKey: 'patientId', onDelete: 'CASCADE' })
  appointments: Appointment[];

  // Virtual field for full name
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Virtual field for age
  get age(): number {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }
}
