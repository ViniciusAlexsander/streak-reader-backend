import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/database.service';
import { ReadPostController } from './readPost.controller';
import { ReadPostService } from './readPost.service';

@Module({
  providers: [ReadPostService, PrismaService],
  exports: [ReadPostService],
  controllers: [ReadPostController],
})
export class ReadPostModule {}
