import type { User, BookMark } from '@prisma/client';

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  signin() {
    return { message: 'I am signin' };
  }

  signup(dto: AuthDto) {
    
    return { message: 'I am signup' };
  }
}
