import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';

@Controller('user')
export class UserController {
  constructor() {}

  @UseGuards(JwtGuard)
  @Get('current')
  getMe(@Req() req: Request) {
    req.user;
    return { ...req.user };
  }
}
