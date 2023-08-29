import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/common/interface/jwt-payload';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {}

  async signIn(userId: number) {
    return await this.issueTokens(userId);
  }

  async refresh(userId: number) {
    return await this.issueTokens(userId);
  }

  async issueTokens(userId: number) {
    const jwtPayload: JwtPayload = { sub: userId };

    const accessToken = this.generateAccessToken(jwtPayload);
    const refreshToken = this.generateRefreshToken(jwtPayload);

    await this.usersService.updateHashedRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }

  generateAccessToken(jwtPayload: JwtPayload) {
    const accessToken = this.jwtService.sign(jwtPayload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });

    return accessToken;
  }

  generateRefreshToken(jwtPayload: JwtPayload) {
    const refreshToken = this.jwtService.sign(jwtPayload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
    });

    return refreshToken;
  }

  async logout(userId: number) {
    await this.usersService.removeRefreshToken(userId);
  }
}
