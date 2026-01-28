import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from '../common/services/base.service';
import { Profile } from '../common/types/entities';
import {
  UpdateProfileDto,
  ChangeEmailDto,
  ChangePasswordDto,
  UploadAvatarDto,
} from './dto/profile.dto';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class ProfilesService extends BaseService {
  private readonly logger = new Logger(ProfilesService.name);

  constructor(configService: ConfigService) {
    super(configService);
  }

  async getProfile(userId: string, accessToken: string): Promise<Profile> {
    const supabase = this.getAuthenticatedClient(accessToken);

    // Get profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    // Get user email from auth.users
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      this.logger.warn('Could not fetch user email', userError);
    }

    // Combine profile data with email
    return {
      ...profileData,
      email: user?.email || undefined,
    } as Profile;
  }

  async updateProfile(
    userId: string,
    updateData: UpdateProfileDto,
    accessToken: string,
  ): Promise<Profile> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  }

  async changeEmail(
    userId: string,
    changeEmailDto: ChangeEmailDto,
    accessToken: string,
  ): Promise<{ message: string }> {
    try {
      const supabaseAdmin = this.getAdminClient();

      // Verify user bằng access token
      const {
        data: { user },
        error: userError,
      } = await supabaseAdmin.auth.getUser(accessToken);

      if (userError || !user) {
        this.logger.error('Error verifying user', userError);
        throw new BadRequestException(
          'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.',
        );
      }

      // Verify userId khớp với user từ token
      if (user.id !== userId) {
        throw new BadRequestException('Unauthorized');
      }

      // Update email bằng Admin API
      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        email: changeEmailDto.new_email,
        email_confirm: false, // Yêu cầu xác nhận email mới
      });

      if (error) {
        this.logger.error('Error changing email', error);
        throw new BadRequestException(
          'Không thể thay đổi email. Vui lòng thử lại.',
        );
      }

      return {
        message:
          'Vui lòng kiểm tra email mới để xác nhận thay đổi. Email cũ cũng sẽ nhận được thông báo.',
      };
    } catch (error) {
      this.logger.error('Error in changeEmail', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        'Không thể thay đổi email. Vui lòng thử lại.',
      );
    }
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    accessToken: string,
  ): Promise<{ message: string }> {
    try {
      const supabaseAdmin = this.getAdminClient();

      // Verify user và lấy thông tin
      const {
        data: { user },
        error: userError,
      } = await supabaseAdmin.auth.getUser(accessToken);

      if (userError || !user || !user.email) {
        throw new BadRequestException('Người dùng không hợp lệ.');
      }

      // Verify current password bằng cách thử đăng nhập
      const verifyClient = createClient(this.supabaseUrl, this.supabaseKey);
      const { error: signInError } = await verifyClient.auth.signInWithPassword(
        {
          email: user.email,
          password: changePasswordDto.current_password,
        },
      );

      if (signInError) {
        throw new BadRequestException('Mật khẩu hiện tại không đúng.');
      }

      // Update password bằng Admin API
      const { error: updateError } =
        await supabaseAdmin.auth.admin.updateUserById(user.id, {
          password: changePasswordDto.new_password,
        });

      if (updateError) {
        this.logger.error('Error updating password', updateError);
        throw new BadRequestException(
          'Không thể thay đổi mật khẩu. Vui lòng thử lại.',
        );
      }

      return {
        message: 'Mật khẩu đã được thay đổi thành công!',
      };
    } catch (error) {
      this.logger.error('Error in changePassword', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        'Không thể thay đổi mật khẩu. Vui lòng thử lại.',
      );
    }
  }

  async uploadAvatar(
    userId: string,
    uploadAvatarDto: UploadAvatarDto,
    accessToken: string,
  ): Promise<{ avatar_url: string }> {
    try {
      const supabase = this.getAuthenticatedClient(accessToken);

      // Convert base64 to buffer
      const base64Data = uploadAvatarDto.base64_data.replace(
        /^data:image\/\w+;base64,/,
        '',
      );
      const buffer = Buffer.from(base64Data, 'base64');

      // Generate unique filename
      const timestamp = Date.now();
      const fileExt = uploadAvatarDto.file_name.split('.').pop();
      const fileName = `${userId}/${timestamp}.${fileExt}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, buffer, {
          contentType: uploadAvatarDto.file_type,
          upsert: true,
        });

      if (error) {
        this.logger.error('Error uploading avatar', error);
        throw new BadRequestException(
          'Không thể tải lên avatar. Vui lòng thử lại.',
        );
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(data.path);

      // Update profile with new avatar URL
      await this.updateProfile(userId, { avatar_url: publicUrl }, accessToken);

      return { avatar_url: publicUrl };
    } catch (error) {
      this.logger.error('Error in uploadAvatar', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        'Không thể tải lên avatar. Vui lòng thử lại.',
      );
    }
  }
}
