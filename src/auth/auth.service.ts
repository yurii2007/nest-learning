import type { User, BookMark } from '@prisma/client';
import type { AuthDto } from './dto';

import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    try {
      const hash = await argon.hash(dto.password);

      const user = await this.prisma.user.create({
        data: { email: dto.email, hash },
        select: { email: true, username: true },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User with this email already exist');
        }
      }
    }
  }

  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });

    if (!user) throw new ForbiddenException('Email or password is wrong');

    const isPasswordMatch = await argon.verify(user.hash, dto.password);

    if (!isPasswordMatch)
      throw new ForbiddenException('Email or password is wrong');

    delete user.hash;

    return user;
  }
}
