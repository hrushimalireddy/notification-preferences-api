import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationLog } from '../schemas/notification-log.schema';
import { SendNotificationDto } from '../dto/send-notification.dto';
import { PreferencesService } from './preferences.service';
import { UserPreference } from '../schemas/user-preference.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(NotificationLog.name)
    private notificationLogModel: Model<NotificationLog>,
    private preferencesService: PreferencesService,
  ) {}

  async send(
    sendNotificationDto: SendNotificationDto,
  ): Promise<NotificationLog> {
    const preferences = await this.preferencesService.findOne(
      sendNotificationDto.userId,
    );
    this.validateNotification(sendNotificationDto, preferences);

    const log = new this.notificationLogModel({
      ...sendNotificationDto,
      status: 'pending',
      metadata: sendNotificationDto.content,
    });

    try {
      await this.simulateSending();
      log.status = 'sent';
      log.sentAt = new Date();
    } catch (error) {
      log.status = 'failed';
      log.failureReason = error.message;
    }

    return log.save();
  }

  async getLogs(userId: string): Promise<NotificationLog[]> {
    return this.notificationLogModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getStats(): Promise<any> {
    return this.notificationLogModel
      .aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            sent: { $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] } },
            failed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
          },
        },
      ])
      .exec();
  }

  private async simulateSending(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (Math.random() < 0.1) {
      throw new Error('Simulated sending failure');
    }
  }

  private validateNotification(
    dto: SendNotificationDto,
    preferences: UserPreference,
  ): void {
    if (!preferences.preferences[dto.type]) {
      throw new Error(`User has disabled ${dto.type} notifications`);
    }
    if (!preferences.preferences.channels[dto.channel]) {
      throw new Error(`User has disabled ${dto.channel} channel`);
    }
  }
}
