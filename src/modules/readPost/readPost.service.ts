import {
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  IFindPost,
  IRequestNewReadPost,
  IUsersStreaksRequest,
} from 'src/models/streaks';
import { IUserActivity } from 'src/models/users';
import { calculateDailyStreak } from 'src/utils/date';
import { PrismaService } from '../prisma/database.service';
import { Role } from 'src/utils/enum/role.enum';

@Injectable()
export class ReadPostService {
  constructor(private prisma: PrismaService) {}

  async newReadPost({
    email,
    id,
    utmCampaign,
    utmChannel,
    utmMedium,
    utmSource,
  }: IRequestNewReadPost) {
    try {
      const alreadyExists = await this.prisma.readPost.findFirst({
        where: {
          userEmail: email,
          resourceId: id,
        },
      });

      if (alreadyExists) throw new PreconditionFailedException();

      await this.prisma.readPost.create({
        data: {
          userEmail: email,
          resourceId: id,
          utmCampaign,
          utmChannel,
          utmMedium,
          utmSource,
        },
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async getOneUserStreaks(email: string) {
    const [allReadPosts, user] = await this.prisma.$transaction([
      this.prisma.readPost.findMany({
        where: {
          userEmail: email,
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      }),
      this.prisma.user.findUnique({
        where: {
          email,
        },
      }),
    ]);

    if (!user) {
      throw new NotFoundException();
    }

    const actualStreak = calculateDailyStreak(
      allReadPosts.map((post) => post.createdAt),
    );
    const recordStreak = Math.max(user.recordStreak as number, actualStreak);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { actualStreak, recordStreak },
    });

    return {
      goals: {
        actualStreak,
        recordStreak,
        totalReadPosts: allReadPosts.length,
      },
      readPostHistory: allReadPosts,
    };
  }

  async getAllUserStreaks({ page, pageSize }: IUsersStreaksRequest) {
    const [users, totalCount] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        orderBy: {
          actualStreak: 'desc',
        },
        select: {
          email: true,
          actualStreak: true,
          recordStreak: true,
          updatedAt: true,
          _count: {
            select: {
              readPosts: true,
            },
          },
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
      }),
      this.prisma.user.count(),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      users,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        pageSize,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  // roda a cada hr no minuto 6 por exemplo: 06:06
  @Cron('6 */1 * * *', {
    name: 'updateAllUserStreaks',
    timeZone: 'America/Sao_Paulo',
  })
  async updateAllUserStreaks() {
    const notRegisteredEmails = await this.prisma.readPost.findMany({
      select: {
        userEmail: true,
      },
      distinct: ['userEmail'],
      where: {
        userEmail: {
          notIn: (
            await this.prisma.user.findMany({
              select: { email: true },
            })
          ).map((user) => user.email),
        },
      },
    });

    await this.prisma.user.createMany({
      data: notRegisteredEmails.map((user) => {
        return {
          email: user.userEmail,
          name: '',
          password: '',
          role: Role.User,
        };
      }),
      skipDuplicates: true,
    });

    const users = await this.prisma.user.findMany({
      select: { id: true, email: true, actualStreak: true, recordStreak: true },
    });

    const userActivities = await this.prisma.readPost.findMany({
      where: { userEmail: { in: users.map((user) => user.email) } },
      orderBy: { createdAt: 'asc' },
    });

    const activityMaps = new Map<string, IUserActivity[]>();
    userActivities.map((user) => {
      if (!activityMaps.has(user.userEmail)) {
        activityMaps.set(user.userEmail, []);
      }
      activityMaps.get(user.userEmail)?.push(user);
    });

    const usersUpdates = users.map((user) => {
      const userActivity = activityMaps.get(user.email) || [];
      const actualStreak = calculateDailyStreak(
        userActivity.map((activity) => activity.createdAt),
      );
      const recordStreak = Math.max(user.recordStreak as number, actualStreak);

      return this.prisma.user.update({
        where: { id: user.id },
        data: { actualStreak, recordStreak },
      });
    });

    await this.prisma.$transaction(usersUpdates);
  }
}
