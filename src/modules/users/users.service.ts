import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { ICreateUser } from 'src/models/users';
import { PrismaService } from '../prisma/database.service';
import { Role } from 'src/utils/enum/role.enum';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string, hasRegister = false): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        email,
        AND: hasRegister ? [{ name: '' }, { password: '' }] : [],
      },
    });
  }

  async createUser(user: ICreateUser): Promise<void> {
    const userAlreadyExists = await this.findOne(user.email, true);

    if (
      userAlreadyExists &&
      userAlreadyExists.name !== '' &&
      userAlreadyExists.password !== ''
    )
      throw new PreconditionFailedException('User already exists');

    await this.prisma.user.upsert({
      create: {
        ...user,
        role: Role.User,
      },
      where: {
        email: user.email,
      },
      update: {
        ...user,
      },
    });
  }
}
