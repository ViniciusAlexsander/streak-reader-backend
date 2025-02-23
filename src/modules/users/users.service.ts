import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { ICreateUser } from 'src/models/users';
import { Role } from 'src/utils/enum/role.enum';
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

    if (
      userAlreadyExists &&
      userAlreadyExists.name !== '' &&
      userAlreadyExists.password !== ''
    )
      throw new PreconditionFailedException('User already exists');

    if (
      userAlreadyExists &&
      userAlreadyExists.name === '' &&
      userAlreadyExists.password === ''
    ) {
      await this.prisma.user.update({
        data: {
          name: user.name,
          password: await bcrypt.hash(user.password, 10),
          role: Role.User,
        },
        where: {
          email: user.email,
        },
      });
    }

    if (!userAlreadyExists) {
      await this.prisma.user.create({
        data: {
          ...user,
          password: await bcrypt.hash(user.password, 10),
          role: Role.User,
        },
      });
    }
  }
}
