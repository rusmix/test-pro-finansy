import { Module } from '@nestjs/common';
import { configService } from '../config';
import Redis from 'ioredis';
import { RedisCacheService } from './redisCache.service';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        return new Redis(configService.getRedisConfig());
      },
    },
    RedisCacheService,
  ],
  exports: [RedisCacheService],
})
export class RedisModule {}
