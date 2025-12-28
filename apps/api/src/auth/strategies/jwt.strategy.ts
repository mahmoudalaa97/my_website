import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          // First try to get from cookie
          if (req?.cookies?.accessToken) {
            return req.cookies.accessToken;
          }
          // Then try Authorization header
          const authHeader = req?.headers?.authorization;
          if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', 'your-secret-key'),
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    if (!payload.sub) {
      throw new UnauthorizedException();
    }
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}

