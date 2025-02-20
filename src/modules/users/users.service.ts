import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { ICreateUser } from 'src/models/users';
import { PrismaService } from '../prisma/database.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createUser(user: ICreateUser): Promise<void> {
    const userAlreadyExists = await this.findOne(user.email);

    if (userAlreadyExists)
      throw new PreconditionFailedException('User already exists');

    await this.prisma.user.create({
      data: user,
    });
  }
}
