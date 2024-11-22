// src/modules/notifications.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NotificationLog,
  NotificationLogSchema,
} from '../schemas/notification-log.schema';
import { NotificationsController } from '../controllers/notifications.controller';
import { NotificationsService } from '../services/notifications.service';
import { PreferencesModule } from './preferences.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NotificationLog.name, schema: NotificationLogSchema },
    ]),
    PreferencesModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
