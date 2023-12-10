import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';

import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private UserService: UserService) {}

  @Get('current')
  getMe(@GetUser('id') userId: string, @GetUser('email') email: string) {
    return { userId, email };
  }

  @Patch()
  updateUser(@GetUser('id') userId: string, @Body() dto: EditUserDto) {
    return this.UserService.updateUser(userId, dto);
  }
}
