import { INestApplication, PreconditionFailedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ReadPostService } from '../src/modules/readPost/readPost.service';

jest.mock('../src/modules/auth/auth.guard', () => ({
  AuthGuard: jest.fn().mockImplementation(() => ({ canActivate: () => true })),
}));

describe('ReadPostController (e2e)', () => {
  let app: INestApplication;
  let readPostService: ReadPostService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ReadPostService)
      .useValue({
        newReadPost: jest.fn(),
        getOneUserStreaks: jest.fn(),
        getAllUserStreaks: jest.fn(),
        updateAllUserStreaks: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    readPostService = moduleFixture.get<ReadPostService>(ReadPostService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return HTTP 200 OK for newReadPost with valid query parameters', async () => {
    const query = {
      email: 'test1@example.com',
      id: '123',
      utm_campaign: 'campaign',
      utm_medium: 'medium',
      utm_source: 'source',
      utm_channel: 'channel',
    };

    (readPostService.newReadPost as jest.Mock).mockResolvedValueOnce(undefined);

    return request(app.getHttpServer()).get('/').query(query).expect(200);
  });

  it('should return HTTP 412 Precondition Failed for already existing post', async () => {
    const query = {
      email: 'test2@example.com',
      id: '123',
      utm_campaign: 'campaign',
      utm_medium: 'medium',
      utm_source: 'source',
      utm_channel: 'channel',
    };

    (readPostService.newReadPost as jest.Mock).mockRejectedValueOnce(
      new PreconditionFailedException(),
    );

    return request(app.getHttpServer()).get('/').query(query).expect(412);
  });

  it('should return 200 OK for getOneUserStreaks', async () => {
    const email = 'test1@example.com';
    const mockStreakResponse = {
      goals: {
        actualStreak: 3,
        recordStreak: 5,
        totalReadPosts: 10,
      },
      readPostHistory: [],
    };

    (readPostService.getOneUserStreaks as jest.Mock).mockResolvedValueOnce(
      mockStreakResponse,
    );

    return request(app.getHttpServer())
      .get(`/streaks/${email}`)
      .expect(200)
      .expect(mockStreakResponse);
  });

  it('should return 500 for getAllUserStreaks if no users found', async () => {
    const query = { page: 1, pageSize: 10 };

    (readPostService.getAllUserStreaks as jest.Mock).mockRejectedValueOnce(
      new Error('Internal Server Error'),
    );

    return request(app.getHttpServer())
      .get('/ranking')
      .query(query)
      .expect(500);
  });
});
