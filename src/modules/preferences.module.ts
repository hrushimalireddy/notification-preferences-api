// src/modules/preferences.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserPreference,
  UserPreferenceSchema,
} from '../schemas/user-preference.schema';
import { PreferencesController } from '../controllers/preferences.controller';
import { PreferencesService } from '../services/preferences.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserPreference.name, schema: UserPreferenceSchema },
    ]),
  ],
  controllers: [PreferencesController],
  providers: [PreferencesService],
  exports: [PreferencesService],
})
export class PreferencesModule {}
