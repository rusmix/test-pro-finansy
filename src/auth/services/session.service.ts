import { Injectable } from '@nestjs/common';
import { TokenService } from './token.service';
import { RedisCacheService } from 'src/redis';

export class Session {
  userId: number;
  username: string;
  email: string;
  token: string;
}

@Injectable()
export class SessionService {
  constructor(
    private readonly redisService: RedisCacheService,
    private readonly tokenService: TokenService,
  ) {}

  public async startSession(
    userId: number,
    email: string,
    username: string,
  ): Promise<Session> {
    const token = this.tokenService.signToken(userId);
    const session: Session = { userId, email, username, token };

    await this.redisService.save(token, session);
    return session;
  }

  public async findActive(token: string): Promise<Session | undefined> {
    const payload = this.tokenService.verifyToken(token).payload;

    if (payload?.userId === undefined) {
      return undefined;
    }

    const session = await this.redisService.retrieve<Session>(token);
    return session;
  }
}
