import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { sign, verify, decode } from 'jsonwebtoken';
import { Request } from 'express';
import { configService } from 'src/config';

export interface ITokenPayload {
  payload: {
    userId: number;
  };
}

export type TAuthenticationToken = {
  userId: number;
};

@Injectable()
export class TokenService {
  public signToken(userId: number): string {
    const tokenPayload: ITokenPayload = {
      payload: { userId },
    };

    return sign(tokenPayload, configService.getTokenSecret(), {
      expiresIn: configService.getTokenTTL(),
    });
  }

  private static parseAuthHeader(header: string) {
    const matches = header.match(/(\S+)\s+(\S+)/);

    if (matches) {
      return { scheme: matches[1], value: matches[2] };
    }

    return null;
  }

  extractToken(request: Request): string | null {
    const authHeader = request.headers['authorization'];

    if (authHeader) {
      const authParams = TokenService.parseAuthHeader(authHeader);

      if (authParams && authParams.scheme.toLowerCase() === 'bearer') {
        return authParams.value;
      }
    }

    return null;
  }

  decodeToken(token: string): TAuthenticationToken {
    const { payload } = decode(token) as { payload: { userId: number } };

    if (!payload || !payload.userId) {
      throw new Error('INVALID TOKEN');
    }

    return payload as TAuthenticationToken;
  }

  public verifyToken(token: string): ITokenPayload {
    const decoded = verify(
      token,
      configService.getTokenSecret(),
    ) as ITokenPayload;

    if (!decoded.payload?.userId) {
      throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
    }

    return decoded;
  }
}
