import {
  Column,
  Model,
  Table,
  DataType,
  HasMany,
  BeforeCreate,
  BeforeUpdate,
  IsEmail,
  Unique,
} from 'sequelize-typescript';
import { Patient } from '../patient/patient.model';
import { Appointment } from '../appointment/appointment.model';
import * as bcrypt from 'bcryptjs';

export enum UserRole {
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model {
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

  @Unique
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  username: string;

  @IsEmail
  @Unique
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(UserRole),
    allowNull: false,
  })
  role: UserRole;

  @Column({
    type: DataType.ENUM,
    values: Object.values(UserStatus),
    defaultValue: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  phoneNumber: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  department: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  specialization: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  bio: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isAvailable: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lastLoginAt: Date;

  // Relationships
  @HasMany(() => Patient, {
    foreignKey: 'assignedNurseId',
    onDelete: 'SET NULL',
  })
  assignedPatients: Patient[];

  @HasMany(() => Appointment, { foreignKey: 'doctorId', onDelete: 'CASCADE' })
  doctorAppointments: Appointment[];

  @HasMany(() => Appointment, { foreignKey: 'nurseId', onDelete: 'SET NULL' })
  nurseAppointments: Appointment[];

  // Hooks for password hashing
  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(user: User) {
    if (user.changed('password')) {
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS!) || 12;

      const passwordHash = await bcrypt.hash(
        user.dataValues.password,
        saltRounds,
      );
      user.dataValues.password = passwordHash;
    }
  }

  // Instance method to validate password
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.dataValues.password);
  }
  // Virtual field for full name
  get fullName(): string {
    return `${this.dataValues.firstName} ${this.dataValues.lastName}`;
  }
}
