import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import type { Request } from 'express';
import { extractToken } from '../common/utils/token.utils';
import {
  UpdateProfileDto,
  ChangeEmailDto,
  ChangePasswordDto,
  UploadAvatarDto,
} from './dto/profile.dto';
import type { User, Profile } from '../common/types/entities';

@Controller('profiles')
@UseGuards(AuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  async getMyProfile(
    @CurrentUser() user: User,
    @Req() request: Request,
  ): Promise<Profile> {
    const token = extractToken(request);
    return this.profilesService.getProfile(user.id, token);
  }

  @Put('me')
  async updateMyProfile(
    @CurrentUser() user: User,
    @Body() updateData: UpdateProfileDto,
    @Req() request: Request,
  ): Promise<Profile> {
    const token = extractToken(request);
    return this.profilesService.updateProfile(user.id, updateData, token);
  }

  @Post('change-email')
  async changeEmail(
    @CurrentUser() user: User,
    @Body() changeEmailDto: ChangeEmailDto,
    @Req() request: Request,
  ): Promise<{ message: string }> {
    const token = extractToken(request);
    return this.profilesService.changeEmail(user.id, changeEmailDto, token);
  }

  @Post('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() request: Request,
  ): Promise<{ message: string }> {
    const token = extractToken(request);
    return this.profilesService.changePassword(changePasswordDto, token);
  }

  @Post('upload-avatar')
  async uploadAvatar(
    @CurrentUser() user: User,
    @Body() uploadAvatarDto: UploadAvatarDto,
    @Req() request: Request,
  ): Promise<{ avatar_url: string }> {
    const token = extractToken(request);
    return this.profilesService.uploadAvatar(user.id, uploadAvatarDto, token);
  }
}
