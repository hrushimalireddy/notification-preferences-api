import {
  IsEmail,
  IsString,
  IsBoolean,
  IsEnum,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

class ChannelsDto {
  @IsBoolean()
  email: boolean;

  @IsBoolean()
  sms: boolean;

  @IsBoolean()
  push: boolean;
}

class PreferencesDto {
  @IsBoolean()
  marketing: boolean;

  @IsBoolean()
  newsletter: boolean;

  @IsBoolean()
  updates: boolean;

  @IsEnum(['daily', 'weekly', 'monthly', 'never'])
  frequency: string;

  @ValidateNested()
  @Type(() => ChannelsDto)
  channels: ChannelsDto;
}

export class CreatePreferenceDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEmail()
  email: string;

  @ValidateNested()
  @Type(() => PreferencesDto)
  preferences: PreferencesDto;

  @IsString()
  @IsNotEmpty()
  timezone: string;
}
