import { Module } from '@nestjs/common';
import { AuthModule } from './auth';
import { configService } from './config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    AuthModule,
  ],
})
export class AppModule {}
