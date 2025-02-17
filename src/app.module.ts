import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ReadPostModule } from './modules/readPost/readPost.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [AuthModule, UsersModule, ReadPostModule],
})
export class AppModule {}
