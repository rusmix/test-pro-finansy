import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RedisModuleOptions } from 'nestjs-redis';
import 'dotenv/config';

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getTokenTTL(): number {
    return parseInt(this.getValue('TOKEN_TTL'));
  }

  public getTokenSecret(): string {
    return this.getValue('TOKEN_SECRET');
  }

  public passHashRounds(): number {
    return parseInt(this.getValue('HASH_ROUNDS'));
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',

      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),

      entities: ['dist/**/*.entity.js'],

      migrationsTableName: 'migration',

      migrations: ['src/migration/*.ts'],

      synchronize: true,

      ssl: false,
    };
  }
  public getRedisConfig(): RedisModuleOptions {
    return {
      host: this.getValue('REDIS_HOST'),
      port: parseInt(this.getValue('REDIS_PORT')),
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
  'REDIS_HOST',
  'REDIS_PORT',
  'REDIS_PASSWORD',
  'HASH_ROUNDS',
  'TOKEN_SECRET',
  'TOKEN_TTL',
]);

export { configService };
