import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentAdmin } from '../common/decorators/current-admin.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);

    // Set session for dashboard
    (req.session as any).adminId = result.admin.id;
    (req.session as any).isAuthenticated = true;

    // Set JWT as httpOnly cookie
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      success: true,
      data: result,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
      }
    });
    res.clearCookie('accessToken');
    res.clearCookie('connect.sid');

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentAdmin() admin: { id: string }) {
    const profile = await this.authService.getProfile(admin.id);
    return {
      success: true,
      data: profile,
    };
  }

  @Get('session')
  async checkSession(@Req() req: Request) {
    const session = req.session as any;
    if (session?.isAuthenticated && session?.adminId) {
      const profile = await this.authService.getProfile(session.adminId);
      return {
        success: true,
        data: { isAuthenticated: true, admin: profile },
      };
    }
    return {
      success: true,
      data: { isAuthenticated: false },
    };
  }
}

