import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AlertsService } from './alerts.service';
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
    @Req() request: Request,
  ): Promise<Alert[]> {
    const token = extractToken(request);
    const isReadBool = isRead !== undefined ? isRead === 'true' : undefined;
    return this.alertsService.findAll(user.id, isReadBool, token);
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
  ): Promise<void> {
    const token = extractToken(request);
    return this.alertsService.markAllAsRead(user.id, token);
  }

  @Delete(':id')
  async remove(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<void> {
    const token = extractToken(request);
    return this.alertsService.remove(user.id, id, token);
  }
}
