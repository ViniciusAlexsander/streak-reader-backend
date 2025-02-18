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
  expiresAt: Date;
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
          expiresAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async getOneUserStreaks(email: string) {
    console.log({ email });
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
    allReadPosts.forEach((post) => {
      if (isSunday(dateToCompare)) {
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
    const result: {
      userEmail: string;
      end_date: Date;
      start_date: Date;
      streak_days: number;
    }[] = await this.prisma.$queryRaw`
      WITH consecutive_days AS (
          SELECT 
              "userEmail",
              DATE_TRUNC('day', "createdAt") AS day,
              DATE_TRUNC('day', "createdAt") - INTERVAL '1 day' * RANK() OVER (
                  PARTITION BY "userEmail" 
                  ORDER BY DATE_TRUNC('day', "createdAt")
              ) AS streak_group
          FROM "ReadPost"
          GROUP BY "userEmail", DATE_TRUNC('day', "createdAt")
      )
      SELECT 
          "userEmail", 
          COUNT(DISTINCT day) AS streak_days,
          MIN(day) AS start_date,
          MAX(day) AS end_date
      FROM consecutive_days
      GROUP BY "userEmail", streak_group
      ORDER BY "userEmail", start_date DESC;
    `;

    return result.map((row) => ({
      streak_days: Number(row.streak_days),
      start_date: row.start_date,
      end_date: row.end_date,
      userEmail: row.userEmail,
    }));
  }
}
