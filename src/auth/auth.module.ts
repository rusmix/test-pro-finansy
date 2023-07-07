import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { TokenService, SessionService } from './services';
import { RedisModule } from 'src/redis';

@Module({
  imports: [UsersModule, RedisModule],
  controllers: [AuthController],
  providers: [TokenService, SessionService],
  exports: [TokenService, SessionService],
})
export class AuthModule {}
