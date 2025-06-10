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

export enum DeviceType {
  SPO2 = 'spo2',
  DIGITAL_STETHOSCOPE = 'digital_stethoscope',
  BLOOD_PRESSURE = 'blood_pressure',
  THERMOMETER = 'thermometer',
  WEIGHT_SCALE = 'weight_scale',
  ECG = 'ecg',
}

@Table({
  tableName: 'medical_device_data',
  timestamps: true,
})
export class MedicalDeviceData extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(DeviceType),
    allowNull: false,
  })
  deviceType: DeviceType;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  deviceModel: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  deviceSerialNumber: string;

  // Generic fields for different types of data
  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  numericValue: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  stringValue: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  jsonData: any;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  unit: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  recordedAt: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isAbnormal: boolean;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  abnormalityReason: string;

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
  recordedByUserId: string;

  // Relationships
  @BelongsTo(() => Patient, { foreignKey: 'patientId', onDelete: 'CASCADE' })
  patient: Patient;

  @BelongsTo(() => User, {
    foreignKey: 'recordedByUserId',
    onDelete: 'RESTRICT',
  })
  recordedBy: User;
}
