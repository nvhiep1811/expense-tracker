import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient, Provider } from '@supabase/supabase-js';
import { CheckEmailDto, RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private supabase: SupabaseClient;
  private supabaseAdmin: SupabaseClient<any, any, any>;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');
    const supabaseServiceKey = this.configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    );

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials in environment variables');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);

    // Create admin client with service role key if available
    if (supabaseServiceKey) {
      this.supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }
  }

  /**
   * Check if email already exists in the system
   */
  async checkEmailExists(checkEmailDto: CheckEmailDto): Promise<{
    exists: boolean;
    message: string;
  }> {
    const { email } = checkEmailDto;

    const { data, error } = await this.supabase.rpc('check_email_exists', {
      email_input: email,
    });

    if (error) {
      this.logger.error('Error checking email', error);
      throw new Error('Không thể kiểm tra email. Vui lòng thử lại.');
    }

    const exists = data === true;

    return {
      exists,
      message: exists ? 'Email đã được đăng ký.' : 'Email chưa được đăng ký.',
    };
  }

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto) {
    const { email, password, full_name } = registerDto;

    // Get the frontend URL from environment or use default
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        },
        emailRedirectTo: `${frontendUrl}/auth/callback`,
      },
    });

    return {
      message:
        'Đăng ký thành công. Vui lòng kiểm tra email để xác nhận tài khoản của bạn.',
    };
  }

  /**
   * Login user
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        message: error.message,
      };
    }

    return {
      user: data.user,
      session: data.session,
      message: 'Đăng nhập thành công!',
    };
  }

  /**
   * Logout user
   */
  async logout() {
    const { error } = await this.supabase.auth.signOut();

    if (error) {
      throw error;
    }

    return {
      message: 'Đã đăng xuất thành công!',
    };
  }

  /**
   * Forgot password
   */
  async forgotPassword(email: string) {
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${frontendUrl}/auth/callback`,
    });
    if (error) {
      this.logger.error('Error sending password reset email', error);
      throw new Error(
        'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.',
      );
    }

    return {
      message:
        'Nếu email tồn tại trong hệ thống, một liên kết đặt lại mật khẩu đã được gửi.',
    };
  }

  /**
   * Reset password
   */
  async resetPassword(newPassword: string, accessToken: string) {
    try {
      // Verify the token first
      const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
      const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');

      if (!supabaseUrl || !supabaseKey) {
        throw new Error(
          'Missing Supabase credentials in environment variables',
        );
      }

      const supabaseClient = createClient(supabaseUrl, supabaseKey);

      // Verify token and get user
      const {
        data: { user },
        error: verifyError,
      } = await supabaseClient.auth.getUser(accessToken);

      if (verifyError || !user) {
        this.logger.error('Error verifying token', verifyError);
        throw new Error('Token không hợp lệ hoặc đã hết hạn.');
      }

      if (this.supabaseAdmin) {
        const { error: updateError } =
          await this.supabaseAdmin.auth.admin.updateUserById(user.id, {
            password: newPassword,
          });

        if (updateError) {
          this.logger.error('Error updating password via admin', updateError);
          throw new Error('Không thể cập nhật mật khẩu.');
        }
      } else {
        await supabaseClient.auth.setSession({
          access_token: accessToken,
          refresh_token: '',
        });

        const { error: updateError } = await supabaseClient.auth.updateUser({
          password: newPassword,
        });

        if (updateError) {
          this.logger.error('Error updating password', updateError);
          throw new Error('Không thể cập nhật mật khẩu.');
        }
      }

      return {
        message: 'Mật khẩu đã được đặt lại thành công!',
      };
    } catch (error) {
      this.logger.error('Error resetting password', error);
      if (
        error instanceof Error &&
        (error.message.includes('Token') ||
          error.message.includes('không hợp lệ'))
      ) {
        throw error;
      }
      throw new Error('Không thể đặt lại mật khẩu. Vui lòng thử lại.');
    }
  }

  /**
   * Get OAuth URL for social login
   */
  async getOAuthUrl(provider: Provider) {
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${frontendUrl}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      this.logger.error('Error generating OAuth URL', error);
      throw new Error('Không thể tạo liên kết đăng nhập. Vui lòng thử lại.');
    }

    if (!data.url) {
      this.logger.error('OAuth URL is empty');
      throw new Error('Không thể tạo liên kết đăng nhập. Vui lòng thử lại.');
    }

    return {
      url: data.url,
      provider,
    };
  }
}
