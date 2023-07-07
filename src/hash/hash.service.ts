import { Injectable } from '@nestjs/common';
import { genSalt, compare, hash } from 'bcryptjs';
import { configService } from 'src/config';

@Injectable()
export class HashService {
  public async hashPass(password: string): Promise<string> {
    const salt = await genSalt(configService.passHashRounds());

    return hash(password, salt);
  }

  public compare(text: string, hash: string): Promise<boolean> {
    return compare(text, hash);
  }
}
