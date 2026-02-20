import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Headers,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import {
  CheckEmailDto,
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  OAuthLoginDto,
  SetSessionDto,
} from './dto/auth.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Helper: Get cookie options for httpOnly secure cookies
   */
  private getCookieOptions(maxAgeDays: number = 7) {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    return {
      httpOnly: true,
      secure: isProduction,
      // Production: cross-origin requests (frontend ≠ backend domain) require
      // SameSite=None + Secure. Dev: Lax is fine for localhost.
      sameSite: isProduction ? ('none' as const) : ('lax' as const),
      path: '/',
      maxAge: maxAgeDays * 24 * 60 * 60 * 1000, // Convert days to ms
    };
  }

  /**
   * Helper: Set auth cookies on response
   */
  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken?: string,
  ) {
    res.cookie('access_token', accessToken, this.getCookieOptions(7));
    if (refreshToken) {
      res.cookie('refresh_token', refreshToken, this.getCookieOptions(30));
    }
  }

  /**
   * Helper: Clear auth cookies on response
   */
  private clearAuthCookies(res: Response) {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    const clearOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ('none' as const) : ('lax' as const),
      path: '/',
    };
    res.clearCookie('access_token', clearOptions);
    res.clearCookie('refresh_token', clearOptions);
  }

  /**
   * POST /auth/check-email
   * Check if email is already registered
   */
  @Post('check-email')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async checkEmail(@Body() checkEmailDto: CheckEmailDto) {
    return this.authService.checkEmailExists(checkEmailDto);
  }

  /**
   * POST /auth/register
   * Register a new user
   */
  @Throttle({ auth: { limit: 5, ttl: 60000 } })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * POST /auth/login
   * Login user - sets httpOnly cookies
   */
  @Throttle({ auth: { limit: 5, ttl: 60000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);

    // Set httpOnly cookies if login successful
    if (result.session?.access_token) {
      this.setAuthCookies(
        res,
        result.session.access_token,
        result.session.refresh_token,
      );
    }

    // Don't expose tokens in response body
    const { session, ...safeResult } = result;
    return {
      ...safeResult,
      authenticated: !!session?.access_token,
    };
  }

  /**
   * POST /auth/refresh
   * Silently refresh access token using the httpOnly refresh_token cookie.
   * Called automatically by the frontend axios interceptor on 401.
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = request.cookies?.refresh_token as string | undefined;
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }

    const { session } = await this.authService.refreshSession(refreshToken);

    // Overwrite access_token cookie; also rotate refresh_token if Supabase issued a new one
    res.cookie('access_token', session.access_token, this.getCookieOptions(7));
    if (session.refresh_token) {
      res.cookie(
        'refresh_token',
        session.refresh_token,
        this.getCookieOptions(30),
      );
    }

    return { authenticated: true, message: 'Token đã được làm mới.' };
  }

  /**
   * POST /auth/logout
   * Logout user - clears httpOnly cookies
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async logout(
    @Req() request: Request & { accessToken?: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.logout(request.accessToken);
    this.clearAuthCookies(res);
    return result;
  }

  /**
   * POST /auth/set-session
   * Set httpOnly cookies from tokens (used by OAuth callback & token refresh)
   */
  @Post('set-session')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async setSession(
    @Body() setSessionDto: SetSessionDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Verify the token is valid before setting cookies
    const isValid = await this.authService.verifyToken(
      setSessionDto.access_token,
    );
    if (!isValid) {
      throw new Error('Token không hợp lệ');
    }

    this.setAuthCookies(
      res,
      setSessionDto.access_token,
      setSessionDto.refresh_token,
    );

    return { message: 'Session đã được thiết lập', authenticated: true };
  }

  /**
   * GET /auth/me
   * Get current user profile
   */
  @Get('me')
  @UseGuards(AuthGuard)
  getCurrentUser(@CurrentUser() user: Record<string, unknown>) {
    return {
      user,
      message: 'Lấy thông tin người dùng thành công',
    };
  }

  /**
   * POST /auth/forgot-password
   * Send password reset email
   */
  @Throttle({ auth: { limit: 5, ttl: 60000 } })
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  /**
   * POST /auth/reset-password
   * Reset password with new password
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Headers('authorization') authorization: string,
  ) {
    // Lấy token từ Authorization header
    if (!authorization) {
      throw new Error('Thiếu token xác thực');
    }

    const token = authorization.replace('Bearer ', '');
    return this.authService.resetPassword(resetPasswordDto.new_password, token);
  }

  /**
   * POST /auth/oauth
   * Get OAuth URL for social login (Google, Facebook)
   */
  @Post('oauth')
  @HttpCode(HttpStatus.OK)
  async getOAuthUrl(@Body() oAuthLoginDto: OAuthLoginDto) {
    return this.authService.getOAuthUrl(oAuthLoginDto.provider);
  }
}
