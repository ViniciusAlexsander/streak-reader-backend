import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { isSameDay, isSunday, subtractDay } from 'src/utils/date';
import { PrismaService } from '../prisma/database.service';

export interface IRequestNewReadPost {
  email: string;
  id: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmChannel: string;
}

export interface IFindPost {
  id: number;
  utmCampaign: string | null;
  utmChannel: string | null;
  utmMedium: string | null;
  utmSource: string | null;
  userEmail: string;
  resourceId: string;
  createdAt: Date;
}

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
    const allReadPosts: IFindPost[] = await this.prisma.readPost.findMany({
      where: {
        userEmail: email,
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });

    let dateToCompare = new Date();
    let dailyStreak = 0;
    allReadPosts.forEach((post, index) => {
      if (
        isSunday(dateToCompare) ||
        (isSameDay(post.createdAt, subtractDay(dateToCompare, 1)) &&
          index === 0)
      ) {
        dateToCompare = subtractDay(dateToCompare, 1);
      }
      if (isSameDay(post.createdAt, dateToCompare)) {
        dailyStreak += 1;
        dateToCompare = subtractDay(post.createdAt, 1);
      }
    });

    return { dailyStreak, readPostHistory: allReadPosts };
  }

  async getAllUserStreaks() {
    const topUsers = await this.prisma.readPost.groupBy({
      by: ['userEmail'],
      _count: {
        createdAt: true, // Count of read posts per user
      },
      orderBy: {
        _count: {
          createdAt: 'desc', // Sort by most read posts
        },
      },
      take: 10, // Limit to top 10 users
    });

    return topUsers;
  }
}
