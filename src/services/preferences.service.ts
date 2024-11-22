// src/services/preferences.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPreference } from '../schemas/user-preference.schema';
import { CreatePreferenceDto } from '../dto/create-preference.dto';

@Injectable()
export class PreferencesService {
  constructor(
    @InjectModel(UserPreference.name)
    private preferenceModel: Model<UserPreference>,
  ) {}

  async create(
    createPreferenceDto: CreatePreferenceDto,
  ): Promise<UserPreference> {
    return this.preferenceModel.create(createPreferenceDto);
  }

  async findOne(userId: string): Promise<UserPreference> {
    const preference = await this.preferenceModel.findOne({ userId }).exec();
    if (!preference) {
      throw new NotFoundException(
        `User preferences not found for userId: ${userId}`,
      );
    }
    return preference;
  }

  async update(
    userId: string,
    updatePreferenceDto: Partial<CreatePreferenceDto>,
  ): Promise<UserPreference> {
    const updated = await this.preferenceModel
      .findOneAndUpdate({ userId }, updatePreferenceDto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(
        `User preferences not found for userId: ${userId}`,
      );
    }
    return updated;
  }

  async remove(userId: string): Promise<void> {
    const result = await this.preferenceModel.deleteOne({ userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(
        `User preferences not found for userId: ${userId}`,
      );
    }
  }
}
