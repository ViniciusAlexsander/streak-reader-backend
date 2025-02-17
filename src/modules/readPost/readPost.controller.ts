import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { IRequestNewReadPost, ReadPostService } from './readPost.service';

@Controller('post')
export class ReadPostController {
  constructor(private readPostService: ReadPostService) {}

  @HttpCode(HttpStatus.OK)
  @Post('read')
  newReadPost(@Body() signInDto: IRequestNewReadPost) {
    return this.readPostService.newReadPost(signInDto);
  }
}
