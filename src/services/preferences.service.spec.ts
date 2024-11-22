// src/services/preferences.service.spec.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PreferencesService } from './preferences.service';
import { UserPreference } from '../schemas/user-preference.schema';
import { CreatePreferenceDto } from '../dto/create-preference.dto';
import { NotFoundException } from '@nestjs/common';

describe('PreferencesService', () => {
  let service: PreferencesService;
  let model: Model<UserPreference>;

  const mockCreateDto = {
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PreferencesService,
        {
          provide: getModelToken(UserPreference.name),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            deleteOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PreferencesService>(PreferencesService);
    model = module.get<Model<UserPreference>>(
      getModelToken(UserPreference.name),
    );
  });

  describe('create', () => {
    it('should create user preferences', async () => {
      // Setup: Mock the create method to return the same data
      (model.create as jest.Mock).mockResolvedValueOnce(mockCreateDto);

      // Execute
      const result = await service.create(mockCreateDto);

      // Verify
      expect(model.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockCreateDto.userId,
          email: mockCreateDto.email,
          preferences: mockCreateDto.preferences,
          timezone: mockCreateDto.timezone,
        }),
      );

      expect(result).toEqual(
        expect.objectContaining({
          userId: mockCreateDto.userId,
          email: mockCreateDto.email,
          preferences: mockCreateDto.preferences,
          timezone: mockCreateDto.timezone,
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return user preferences', async () => {
      // Setup
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockCreateDto),
      } as any);

      // Execute
      const result = await service.findOne('user123');

      // Verify
      expect(model.findOne).toHaveBeenCalledWith({ userId: 'user123' });
      expect(result).toEqual(mockCreateDto);
    });

    it('should throw NotFoundException when user not found', async () => {
      // Setup
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      // Execute & Verify
      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update user preferences', async () => {
      // Setup
      const updateDto = { email: 'updated@example.com' };
      const updatedPreference = { ...mockCreateDto, ...updateDto };

      jest.spyOn(model, 'findOneAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(updatedPreference),
      } as any);

      // Execute
      const result = await service.update('user123', updateDto);

      // Verify
      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: 'user123' },
        expect.any(Object),
        { new: true },
      );
      expect(result).toEqual(updatedPreference);
    });
  });

  describe('remove', () => {
    it('should delete user preferences', async () => {
      // Setup
      jest.spyOn(model, 'deleteOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce({ deletedCount: 1 }),
      } as any);

      // Execute & Verify
      await expect(service.remove('user123')).resolves.not.toThrow();
      expect(model.deleteOne).toHaveBeenCalledWith({ userId: 'user123' });
    });

    it('should throw NotFoundException when user not found for deletion', async () => {
      // Setup
      jest.spyOn(model, 'deleteOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce({ deletedCount: 0 }),
      } as any);

      // Execute & Verify
      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
