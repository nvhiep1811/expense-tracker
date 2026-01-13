import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CheckEmailDto, RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials in environment variables');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
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
      console.error('Error checking email:', error);
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

    await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        },
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
}
