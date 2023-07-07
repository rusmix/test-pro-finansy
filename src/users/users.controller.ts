import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async findMe(
    @Request()
    request: Request & {
      user: { userId: number };
    },
  ) {
    const userId = request.user.userId;
    const user = await this.usersService.findOne(userId);
    if (!user)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    return user;
  }

  @Patch('me')
  update(
    @Request()
    request: Request & {
      user: { userId: number };
    },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(request.user.userId, updateUserDto);
  }
}
