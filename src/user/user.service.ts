import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserRole } from './user.model';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { Op } from 'sequelize';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    const existingUser = await this.userModel.findOne({
      where: {
        [Op.or]: [
          { username: createUserDto.username },
          { email: createUserDto.email },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    console.log('Creating user with data:', createUserDto);
    const user = await this.userModel.create(createUserDto as any);
    // const user = new User(createUserDto as any);

    return user;
  }

  async findAll(): Promise<any> {
    return this.userModel.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(id: string): Promise<any> {
    const user = await this.userModel.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByUsername(username: string): Promise<any> {
    return this.userModel.findOne({
      where: { username },
      attributes: { exclude: ['password'] },
    });
  }

  async getDoctors(): Promise<any> {
    return this.userModel.findAll({
      where: { role: UserRole.DOCTOR },
      attributes: { exclude: ['password'] },
      order: [['firstName', 'ASC']],
    });
  }

  async getAvailableDoctors(): Promise<any> {
    return this.userModel.findAll({
      where: {
        role: UserRole.DOCTOR,
        isAvailable: true,
        status: 'active',
      },
      attributes: { exclude: ['password'] },
      order: [['firstName', 'ASC']],
    });
  }

  async getNurses(): Promise<any> {
    return this.userModel.findAll({
      where: { role: UserRole.NURSE },
      attributes: { exclude: ['password'] },
      order: [['firstName', 'ASC']],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    const user = await this.findById(id);

    if (updateUserDto.username || updateUserDto.email) {
      const existingUser = await this.userModel.findOne({
        where: {
          id: { [Op.ne]: id },
          [Op.or]: [
            { username: updateUserDto.username },
            { email: updateUserDto.email },
          ],
        },
      });

      if (existingUser) {
        throw new ConflictException('Username or email already exists');
      }
    }

    await user.update(updateUserDto);
    return this.findById(id);
  }

  async remove(id: string): Promise<any> {
    const user = await this.findById(id);
    await user.destroy();
  }

  async validateUser(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const { username, password } = authCredentialsDto;
    const user = await this.userModel.findOne({ where: { username } });
    console.log(password);
    if (user && (await user.validatePassword(password))) {
      return user;
    }

    return null;
  }

  async updateLastLogin(id: string): Promise<any> {
    await this.userModel.update({ lastLoginAt: new Date() }, { where: { id } });
  }
}
