import { Controller, Get, UseGuards, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { GetUser } from 'src/common/custom-decorators/get-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async redirectGoogleAuthPage(): Promise<void> {}

  @ApiOperation({ 
    description: '구글 로그인 callback', 
    summary: '구글 로그인' 
  })
  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async signInWithGoogle(@GetUser('id') userId: number) {
    const { accessToken, refreshToken } = await this.authService.signIn(userId);

    return { 
      access_token: accessToken, 
      refresh_token: refreshToken 
    };
  }

  @ApiOperation({ 
    description: 'refresh token으로 token을 재발급', 
    summary: '인증 토큰 재발급' 
  })
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async reissueTokens(@GetUser('id') userId: number) {
    const { accessToken, refreshToken } = await this.authService.refresh(userId);

    return { 
      access_token: accessToken, 
      refresh_token: refreshToken 
    };  
  }

  @ApiOperation({ 
    summary: '로그아웃' 
  })
  @Post('logout')
  @UseGuards(JwtRefreshGuard)
  async logout(@GetUser('id') userId: number) {
    await this.authService.logout(userId);
    
    return { success: true };
  }
}