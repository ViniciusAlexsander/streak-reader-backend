import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from 'src/utils/enum/role.enum';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
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
  @Get('streaks/:email')
  @UseGuards(AuthGuard)
  getOneUserStreaks(@Param('email') email: string) {
    return this.readPostService.getOneUserStreaks(email);
  }

  @HttpCode(HttpStatus.OK)
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('ranking')
  getAllUserStreaks(@Query() query: { page: string; pageSize: string }) {
    return this.readPostService.getAllUserStreaks({
      page: query.page ? Number(query.page) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 10,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Put('ranking')
  updateAllUserStreaks() {
    return this.readPostService.updateAllUserStreaks();
  }
}
