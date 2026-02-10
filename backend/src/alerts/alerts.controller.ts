import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
  Req,
  Post,
} from '@nestjs/common';
import { AlertsService, AlertWithDetails } from './alerts.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import type { Request } from 'express';
import { extractToken } from '../common/utils/token.utils';
import type { User, Alert } from '../common/types/entities';

@Controller('alerts')
@UseGuards(AuthGuard)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  async findAll(
    @CurrentUser() user: User,
    @Query('is_read') isRead: string | undefined,
    @Query('limit') limit: string | undefined,
    @Req() request: Request,
  ): Promise<AlertWithDetails[]> {
    const token = extractToken(request);
    const isReadBool = isRead !== undefined ? isRead === 'true' : undefined;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return this.alertsService.findAll(user.id, isReadBool, token, limitNum);
  }

  @Get('unread-count')
  async getUnreadCount(
    @CurrentUser() user: User,
    @Req() request: Request,
  ): Promise<{ count: number }> {
    const token = extractToken(request);
    const count = await this.alertsService.getUnreadCount(user.id, token);
    return { count };
  }

  @Post('check-budgets')
  async checkBudgets(
    @CurrentUser() user: User,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const token = extractToken(request);
    await this.alertsService.checkAndCreateBudgetAlerts(user.id, token);
    return { success: true };
  }

  @Put(':id/read')
  async markAsRead(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<Alert> {
    const token = extractToken(request);
    return this.alertsService.markAsRead(user.id, id, token);
  }

  @Put('read-all')
  async markAllAsRead(
    @CurrentUser() user: User,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const token = extractToken(request);
    await this.alertsService.markAllAsRead(user.id, token);
    return { success: true };
  }

  @Put(':id/dismiss')
  async dismiss(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<Alert> {
    const token = extractToken(request);
    return this.alertsService.dismiss(user.id, id, token);
  }

  @Put('dismiss-all')
  async dismissAll(
    @CurrentUser() user: User,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const token = extractToken(request);
    await this.alertsService.dismissAll(user.id, token);
    return { success: true };
  }

  @Delete('all')
  async removeAll(
    @CurrentUser() user: User,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const token = extractToken(request);
    await this.alertsService.removeAll(user.id, token);
    return { success: true };
  }

  @Delete(':id')
  async remove(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const token = extractToken(request);
    await this.alertsService.remove(user.id, id, token);
    return { success: true };
  }
}
