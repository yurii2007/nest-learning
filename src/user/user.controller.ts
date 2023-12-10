import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

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
