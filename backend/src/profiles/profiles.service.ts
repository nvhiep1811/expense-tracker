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

  async getProfile(
    userId: string,
    accessToken: string,
    userEmail?: string,
  ): Promise<Profile> {
    const supabase = this.getAuthenticatedClient(accessToken);
    let email = userEmail;
    let avatarUrl: string | null = null;

    // Fallback only when email claim is not present in access token.
    if (!email) {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        this.logger.warn('Could not fetch user email', userError);
      } else {
        email = user?.email || undefined;
        avatarUrl = user?.user_metadata?.avatar_url || null;
      }
    }

    // Get profile data - use maybeSingle to handle case when no profile exists
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select(
        'id, full_name, avatar_url, default_currency, timezone, month_start_day, created_at, updated_at',
      )
      .eq('id', userId)
      .maybeSingle();

    if (profileError) throw profileError;

    // If no profile exists, create one with defaults
    if (!profileData) {
      this.logger.log(`Creating missing profile for user ${userId}`);
      const userName = email ? email.split('@')[0] : 'Người dùng';

      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: userName,
          avatar_url: avatarUrl,
          default_currency: 'VND',
          timezone: 'Asia/Ho_Chi_Minh',
          month_start_day: 1,
        })
        .select()
        .single();

      if (createError) {
        this.logger.error('Failed to create profile', createError);
        throw createError;
      }

      return {
        ...newProfile,
        email,
      } as Profile;
    }

    // Combine profile data with email
    return {
      ...profileData,
      email,
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
    _accessToken: string,
  ): Promise<{ message: string }> {
    try {
      const supabaseAdmin = this.getAdminClient();

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
    userId: string,
    userEmail: string | undefined,
    changePasswordDto: ChangePasswordDto,
    accessToken: string,
  ): Promise<{ message: string }> {
    try {
      const supabaseAdmin = this.getAdminClient();
      let email = userEmail;

      if (!email) {
        const verifyClient = this.getAuthenticatedClient(accessToken);
        const {
          data: { user },
          error: userError,
        } = await verifyClient.auth.getUser();

        if (userError || !user?.email) {
          throw new BadRequestException('Người dùng không hợp lệ.');
        }
        email = user.email;
      }

      // Verify current password by attempting a sign-in with a lightweight,
      // non-persisting client (avoids polluting any session state)
      const verifyClient = createClient(this.supabaseUrl, this.supabaseKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const { error: signInError } = await verifyClient.auth.signInWithPassword(
        {
          email,
          password: changePasswordDto.current_password,
        },
      );

      if (signInError) {
        throw new BadRequestException('Mật khẩu hiện tại không đúng.');
      }

      // Update password bằng Admin API
      const { error: updateError } =
        await supabaseAdmin.auth.admin.updateUserById(userId, {
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
