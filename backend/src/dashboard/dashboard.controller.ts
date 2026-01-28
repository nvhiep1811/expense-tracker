import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { DashboardService } from '../common/services/dashboard.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { extractToken } from '../common/utils/token.utils';
import type { Request } from 'express';
import type { User } from '../common/types/entities';
import type {
  DashboardStats,
  MonthlyCashflow,
} from '../common/services/dashboard.service';

@Controller('dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * Get comprehensive dashboard statistics
   * Optimized using database views
   */
  @Get('stats')
  async getStats(
    @CurrentUser() user: User,
    @Req() request: Request,
  ): Promise<DashboardStats> {
    const token = extractToken(request);
    return this.dashboardService.getDashboardStats(user.id, token);
  }

  /**
   * Get monthly cashflow trends
   */
  @Get('cashflow')
  async getCashflow(
    @CurrentUser() user: User,
    @Req() request: Request,
    @Query('months') months?: string,
  ): Promise<MonthlyCashflow[]> {
    const token = extractToken(request);
    const monthsCount = months ? parseInt(months, 10) : 6;
    return this.dashboardService.getMonthlyCashflow(
      user.id,
      token,
      monthsCount,
    );
  }

  /**
   * Get current net worth
   */
  @Get('net-worth')
  async getNetWorth(
    @CurrentUser() user: User,
    @Req() request: Request,
  ): Promise<{ net_worth: number }> {
    const token = extractToken(request);
    const netWorth = await this.dashboardService.getNetWorth(user.id, token);
    return { net_worth: netWorth };
  }
}
