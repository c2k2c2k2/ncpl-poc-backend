import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from '../user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{
    accessToken: string;
    user: Partial<User>;
  }> {
    const user = await this.userService.validateUser(authCredentialsDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    // Update last login time
    await this.userService.updateLastLogin(user.id);

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status,
        isAvailable: user.isAvailable,
      },
    };
  }

  async register(createUserDto: CreateUserDto): Promise<any> {
    return this.userService.create(createUserDto);
  }

  async validateToken(token: string): Promise<any> {
    try {
      console.log('token:', token);
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
