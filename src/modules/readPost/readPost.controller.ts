import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ReadPostService } from './readPost.service';

@Controller('')
export class ReadPostController {
  constructor(private readPostService: ReadPostService) {}

  @HttpCode(HttpStatus.OK)
  @Get('')
  newReadPost(@Query() queryParams: Record<string, string>) {
    console.log('All Query Params:', queryParams);

    const { email, id, utm_source, utm_medium, utm_campaign, utm_channel } =
      queryParams;

    return this.readPostService.newReadPost({
      email,
      id,
      utmCampaign: utm_campaign,
      utmChannel: utm_channel,
      utmMedium: utm_medium,
      utmSource: utm_source,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Get('ranking')
  getAllUserStreaks() {
    return this.readPostService.getAllUserStreaks();
  }

  @HttpCode(HttpStatus.OK)
  @Get('streaks/:email')
  getOneUserStreaks(@Param('email') email: string) {
    return this.readPostService.getOneUserStreaks(email);
  }
}
