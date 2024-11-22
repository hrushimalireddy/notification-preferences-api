import { IsString, IsNotEmpty, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class NotificationContent {
  @IsString()
  subject: string;

  @IsString()
  body: string;
}

export class SendNotificationDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(['marketing', 'newsletter', 'updates'])
  type: string;

  @IsEnum(['email', 'sms', 'push'])
  channel: string;

  @ValidateNested()
  @Type(() => NotificationContent)
  content: NotificationContent;
}
