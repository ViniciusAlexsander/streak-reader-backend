import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReadPostService } from './readPost.service';
import { Role } from 'src/utils/enum/role.enum';
import { Roles } from '../auth/roles.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

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
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  getAllUserStreaks() {
    return this.readPostService.getAllUserStreaks();
  }

  @HttpCode(HttpStatus.OK)
  @Get('streaks/:email')
  @UseGuards(AuthGuard)
  getOneUserStreaks(@Param('email') email: string) {
    return this.readPostService.getOneUserStreaks(email);
  }
}
