import { ForbiddenException, Injectable } from '@nestjs/common';

import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async getBookmarks(userID: string) {
    return await this.prisma.bookMark.findMany({
      where: {
        userID,
      },
    });
  }

  getBookmarkById(userID: string, bookmarkId: string) {
    return this.prisma.bookMark.findFirst({
      where: {
        userID,
        id: bookmarkId,
      },
    });
  }

  async createBookmark(userID: string, dto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookMark.create({
      data: {
        userID,
        ...dto,
      },
    });
    return bookmark;
  }

  async editBookmarkById(
    userID: string,
    bookmarkId: string,
    dto: EditBookmarkDto,
  ) {
    const bookMark = await this.prisma.bookMark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookMark || bookMark.userID !== userID) {
      throw new ForbiddenException('Access to resource denied');
    }

    return this.prisma.bookMark.update({
      where: { id: bookmarkId },
      data: { ...dto },
    });
  }

  async deleteBookmarkById(userID: string, bookmarkId: string) {
    const bookMark = await this.prisma.bookMark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookMark || bookMark.userID !== userID) {
      throw new ForbiddenException('Access to resource denied');
    }

    this.prisma.bookMark.delete({ where: { id: bookmarkId } });
  }
}
