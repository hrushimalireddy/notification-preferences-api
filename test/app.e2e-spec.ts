// test/app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Model } from 'mongoose';
import { UserPreference } from '../src/schemas/user-preference.schema';
import { getModelToken } from '@nestjs/mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let preferenceModel: Model<UserPreference>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
        MongooseModule.forRoot(
          process.env.MONGODB_URI ||
            'mongodb://localhost:27017/notifications-test',
        ),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    preferenceModel = moduleFixture.get<Model<UserPreference>>(
      getModelToken(UserPreference.name),
    );
    await app.init();
  });

  afterEach(async () => {
    await preferenceModel.deleteMany({}).exec();
    await app.close();
  });

  const mockPreference = {
    userId: 'user123',
    email: 'test@example.com',
    preferences: {
      marketing: true,
      newsletter: false,
      updates: true,
      frequency: 'weekly',
      channels: {
        email: true,
        sms: false,
        push: true,
      },
    },
    timezone: 'America/New_York',
  };

  describe('/api/preferences (POST)', () => {
    it('should create user preferences', () => {
      return request(app.getHttpServer())
        .post('/api/preferences')
        .send(mockPreference)
        .expect(201)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              userId: mockPreference.userId,
              email: mockPreference.email,
              preferences: mockPreference.preferences,
              timezone: mockPreference.timezone,
            }),
          );
        });
    });
  });

  describe('/api/preferences/:userId (GET)', () => {
    it('should get user preferences', async () => {
      // First create a preference
      await preferenceModel.create(mockPreference);

      return request(app.getHttpServer())
        .get(`/api/preferences/${mockPreference.userId}`)
        .expect(200)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              userId: mockPreference.userId,
              email: mockPreference.email,
            }),
          );
        });
    });

    it('should return 404 for non-existent user', () => {
      return request(app.getHttpServer())
        .get('/api/preferences/nonexistent')
        .expect(404);
    });
  });

  describe('/api/preferences/:userId (PATCH)', () => {
    it('should update user preferences', async () => {
      // First create a preference
      await preferenceModel.create(mockPreference);

      const updateData = {
        email: 'updated@example.com',
      };

      return request(app.getHttpServer())
        .patch(`/api/preferences/${mockPreference.userId}`)
        .send(updateData)
        .expect(200)
        .expect((response) => {
          expect(response.body.email).toBe(updateData.email);
        });
    });
  });

  describe('/api/preferences/:userId (DELETE)', () => {
    it('should delete user preferences', async () => {
      // First create a preference
      await preferenceModel.create(mockPreference);

      return request(app.getHttpServer())
        .delete(`/api/preferences/${mockPreference.userId}`)
        .expect(200);
    });
  });
});
