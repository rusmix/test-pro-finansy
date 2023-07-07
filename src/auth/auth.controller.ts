import { Controller, Post, Body } from '@nestjs/common';
import { UsersService as UserService } from '../users/users.service';
import { SessionService } from './services';

type CredentialsDto = {
  email: string;
  password: string;
};

type SignUpDto = {
  username: string;
} & CredentialsDto;

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
  ) {}

  @Post('signin')
  public async signIn(@Body() input: CredentialsDto): Promise<{
    accessToken: string;
  }> {
    const { email, password } = input;

    const user = await this.userService.findByEmailAndPassword(email, password);

    const session = await this.sessionService.startSession(
      user.id,
      user.email,
      user.username,
    );

    return { accessToken: session.token };
  }

  @Post('signup')
  public async signUp(@Body() input: SignUpDto): Promise<{ email: string }> {
    const { email, password, username } = input;
    const user = await this.userService.create({ username, email, password });

    return { email: user.email };
  }
}
