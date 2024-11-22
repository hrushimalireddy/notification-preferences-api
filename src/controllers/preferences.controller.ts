import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PreferencesService } from '../services/preferences.service';
import { CreatePreferenceDto } from '../dto/create-preference.dto';
import { UserPreference } from '../schemas/user-preference.schema';
import { RateLimitGuard } from '../guards/rate-limit.guard';

@Controller('api/preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Post()
  @UseGuards(RateLimitGuard)
  create(@Body() createPreferenceDto: CreatePreferenceDto) {
    return this.preferencesService.create(createPreferenceDto);
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.preferencesService.findOne(userId);
  }

  @Patch(':userId')
  @UseGuards(RateLimitGuard)
  update(
    @Param('userId') userId: string,
    @Body() updatePreferenceDto: Partial<CreatePreferenceDto>,
  ) {
    return this.preferencesService.update(userId, updatePreferenceDto);
  }

  @Delete(':userId')
  remove(@Param('userId') userId: string) {
    return this.preferencesService.remove(userId);
  }
}
