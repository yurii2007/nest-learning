import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookMark } from './bookmark/bookmark.module';

@Module({
  imports: [AuthModule, UserModule, BookMark],
  controllers: [],
  providers: [],
})
export class AppModule {}
