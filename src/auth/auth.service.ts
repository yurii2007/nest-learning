import type { User, BookMark } from '@prisma/client';
import type { AuthDto } from './dto';

import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: AuthDto) {
    try {
      const hash = await argon.hash(dto.password);

      const user = await this.prisma.user.create({
        data: { email: dto.email, hash },
      });
  

      return {
        message: 'Register was successfully',
        accessToken: await this.signToken(user.id, user.email),
      };
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

    return {
      message: 'Login was successfully',
      accessToken: await this.signToken(user.id, user.email),
    };
  }

  signToken(userId: string, email: string): Promise<string> {
    const payload = { sub: userId, email };

    return this.jwt.signAsync(payload, {
      expiresIn: '12h',
      secret: this.config.get('JWT_SECRET'),
    });
  }
}
