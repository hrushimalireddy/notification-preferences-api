import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class Channels {
  @Prop({ required: true })
  email: boolean;

  @Prop({ required: true })
  sms: boolean;

  @Prop({ required: true })
  push: boolean;
}

@Schema()
class Preferences {
  @Prop({ required: true })
  marketing: boolean;

  @Prop({ required: true })
  newsletter: boolean;

  @Prop({ required: true })
  updates: boolean;

  @Prop({ required: true, enum: ['daily', 'weekly', 'monthly', 'never'] })
  frequency: string;

  @Prop({ required: true, type: Channels })
  channels: Channels;
}

@Schema({ timestamps: true })
export class UserPreference extends Document {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, type: Preferences })
  preferences: Preferences;

  @Prop({ required: true })
  timezone: string;

  @Prop()
  lastUpdated: Date;

  @Prop()
  createdAt: Date;
}

export const UserPreferenceSchema =
  SchemaFactory.createForClass(UserPreference);
