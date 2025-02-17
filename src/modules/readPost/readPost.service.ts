import {
  Injectable,
  UnauthorizedException,
  PreconditionFailedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/database.service';

export interface IRequestNewReadPost {
  email: string;
  id: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmChannel: string;
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
}
