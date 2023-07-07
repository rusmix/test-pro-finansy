import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { TokenService } from './services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.tokenService.extractToken(request);
    request.user = this.tokenService.decodeToken(token);
    return !!token;
  }
}
