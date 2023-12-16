import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';

import type { AuthDto } from '../src/auth/dto';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

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
    pactum.request.setBaseUrl('http://localhost:3000/');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = { email: 'test@email.com', password: '12345678' };
    describe('Sign Up', () => {
      it('Should throw invalid body with incorrect body', () =>
        pactum
          .spec()
          .post('auth/signup')
          .withBody({ password: dto.password })
          .expectStatus(400));

      it('Should throw invalid body with incorrect body', () =>
        pactum
          .spec()
          .post('auth/signup')
          .withBody({ email: dto.password })
          .expectStatus(400));

      it('Should throw invalid body with no body provided', () =>
        pactum.spec().post('auth/signup').expectStatus(400));

      it('Should sign up', () =>
        pactum.spec().post('auth/signup').withBody(dto).expectStatus(201));
    });

    describe('Sign In', () => {
      it('Should throw invalid body with incorrect body', () =>
        pactum
          .spec()
          .post('auth/signin')
          .withBody({ password: dto.password })
          .expectStatus(400));

      it('Should throw invalid body with incorrect body', () =>
        pactum
          .spec()
          .post('auth/signin')
          .withBody({ email: dto.password })
          .expectStatus(400));

      it('Should throw invalid body with no body provided', () =>
        pactum.spec().post('auth/signin').expectStatus(400));

      it('should sign in', () =>
        pactum
          .spec()
          .post('auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userToken', 'accessToken'));
    });
  });

  describe('User', () => {
    describe('Get current user', () => {
      it('should return info about user based on auth token', () =>
        pactum
          .spec()
          .withBearerToken('$S{userToken}')
          .get('users/current')
          .expectStatus(200));
    });

    describe('Edit user', () => {
      it('should return info about user based on auth token', () =>
        pactum
          .spec()
          .withBearerToken('$S{userToken}')
          .patch('users')
          .withBody({ username: 'updated username' })
          .expectStatus(200));
    });
  });

  describe('Bookmark', () => {
    describe('Post bookmark', () => {
      const dto: CreateBookmarkDto = {
        title: 'bookmark',
        link: 'google.com',
        description: 'desc',
      };
      it('should create a bookmark', () => {
        return pactum
          .spec()
          .post('bookmarks')
          .withBearerToken('$S{userToken}')
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkID', 'id');
      });
    });

    describe('Get bookmarks', () => {
      it('should return an array of books', () => {
        return pactum
          .spec()
          .get('bookmarks')
          .withBearerToken('$S{userToken}')
          .expectStatus(200);
      });
    });

    describe('Get bookmark by id', () => {
      it('should get bookmark by id', () => {
        return pactum
          .spec()
          .get('bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkID}')
          .withBearerToken('$S{userToken}')
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkID}');
      });
    });

    describe('Edit bookmark by id', () => {
      const dto: EditBookmarkDto = {
        title: 'updated title',
        description: 'updated description',
      };
      it('should edit bookmark', () => {
        return pactum
          .spec()
          .patch('bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkID}')
          .withBearerToken('$S{userToken}')
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description)
          .withBody(dto);
      });
    });

    describe('Delete bookmark by id', () => {
      it('should delete bookmark', () => {
        return pactum
          .spec()
          .delete('bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkID}')
          .withBearerToken('$S{userToken}')
          .expectStatus(204);
      });
    });
  });
});
