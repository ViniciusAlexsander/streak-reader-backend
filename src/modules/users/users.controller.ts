import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ICreateUser } from 'src/models/users';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Post('')
  createUser(@Body() user: ICreateUser) {
    return this.usersService.createUser(user);
  }
}
