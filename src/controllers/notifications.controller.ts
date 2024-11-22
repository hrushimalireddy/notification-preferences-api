import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';
import { SendNotificationDto } from '../dto/send-notification.dto';
import { RateLimitGuard } from '../guards/rate-limit.guard';

@Controller('api/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send')
  @UseGuards(RateLimitGuard)
  send(@Body() sendNotificationDto: SendNotificationDto) {
    return this.notificationsService.send(sendNotificationDto);
  }

  @Get(':userId/logs')
  getLogs(@Param('userId') userId: string) {
    return this.notificationsService.getLogs(userId);
  }

  @Get('stats')
  getStats() {
    return this.notificationsService.getStats();
  }
}
