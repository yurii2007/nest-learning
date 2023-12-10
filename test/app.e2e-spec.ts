import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';

import type { AuthDto } from '../src/auth/dto';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();
    await app.listen(3001);

    prisma = app.get(PrismaService);
    pactum.request.setBaseUrl('http://localhost:3001/')
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = { email: 'test@email.com', password: '12345678' };
    describe('Sign Up', () => {
      it('Should sign up', () => {
        return pactum
          .spec()
          .post('auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Sign In', () => {
      it.todo('should sign up');
    });
  });

  describe('User', () => {
    describe('Get current user', () => {});

    describe('Edit user', () => {});
  });

  describe('Bookmark', () => {
    describe('Get bookmarks', () => {});

    describe('Get bookmark by id', () => {});

    describe('Post bookmark', () => {});

    describe('Edit bookmark', () => {});

    describe('Delete bookmark', () => {});
  });

  it.todo('should pass');
});
