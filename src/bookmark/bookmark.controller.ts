import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorator';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Get()
  getBookmarks(@GetUser('id') userId: string) {
    return this.bookmarkService.getBookmarks(userId);
  }

  @Get(':id')
  getBookmarkById(
    @GetUser('id') userId: string,
    @Param('id') bookmarkId: string,
  ) {
    return this.bookmarkService.getBookmarkById(userId, bookmarkId);
  }

  @Post()
  createBookmark(
    @GetUser('id') userId: string,
    @Body() dto: CreateBookmarkDto,
  ) {
    return this.bookmarkService.createBookmark(userId, dto);
  }

  @Patch(':id')
  editBookmarkById(
    @GetUser('id') userId: string,
    @Param('id') bookmarkId: string,
    @Body() dto: EditBookmarkDto,
  ) {
    return this.bookmarkService.editBookmarkById(userId, bookmarkId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBookmarkById(
    @GetUser('id') userId: string,
    @Param('id') bookmarkId: string,
  ) {
    return this.bookmarkService.deleteBookmarkById(userId, bookmarkId);
  }
}
