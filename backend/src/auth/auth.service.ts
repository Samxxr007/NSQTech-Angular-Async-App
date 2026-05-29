import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { ConfigService } from '../config/config.service';
import { User, SafeUser } from '../models/user.model';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: SafeUser;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<SafeUser> {
    const user: User | undefined = this.databaseService
      .getUsers()
      .find({ email: loginDto.email })
      .value();

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated. Contact administrator.');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { password: _password, ...safeUser } = user;
    return safeUser;
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(loginDto);

    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.jwtExpiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.jwtRefreshExpiresIn,
    });

    this.logger.log(`User logged in: ${user.email}`);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async refreshToken(currentUser: SafeUser): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: TokenPayload = {
      sub: currentUser.id,
      email: currentUser.email,
      role: currentUser.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.jwtExpiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.jwtRefreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  getProfile(userId: string): SafeUser {
    const user: User | undefined = this.databaseService
      .getUsers()
      .find({ id: userId })
      .value();

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password: _password, ...safeUser } = user;
    return safeUser;
  }
}
