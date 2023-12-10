import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor() {}

  @Get('current')
  getMe(@GetUser('id') userId: string, @GetUser('email') email: string) {
    return { userId, email };
  }

  @Patch()
  editUser() {}
}
