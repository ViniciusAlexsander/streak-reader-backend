import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ReadPostService } from './readPost.service';

@Controller('')
export class ReadPostController {
  constructor(private readPostService: ReadPostService) {}

  @HttpCode(HttpStatus.OK)
  @Get('')
  newReadPost(
    @Query('id') id: string,
    @Query('email') email: string,
    @Query('utm_source') utmSource: string,
    @Query('utm_medium') utmMedium: string,
    @Query('utm_campaign') utmCampaign: string,
    @Query('utm_channel') utmChannel: string,
  ) {
    return this.readPostService.newReadPost({
      email,
      id,
      utmCampaign,
      utmChannel,
      utmMedium,
      utmSource,
    });
  }
}
