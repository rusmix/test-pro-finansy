import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisCacheService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async save(key: string, value: any) {
    await this.redisClient.set(key, JSON.stringify(value));
  }

  async retrieve<T>(key: string): Promise<T> {
    const client = this.redisClient;
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  }
}
