import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BudgetsService, BudgetStatusResponse } from './budgets.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import type { Request } from 'express';
import { extractToken } from '../common/utils/token.utils';
import { CreateBudgetDto, UpdateBudgetDto } from './dto/budget.dto';
import type { User, Budget } from '../common/types/entities';

@Controller('budgets')
@UseGuards(AuthGuard)
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Get()
  async findAll(
    @CurrentUser() user: User,
    @Req() request: Request,
  ): Promise<Budget[]> {
    const token = extractToken(request);
    return this.budgetsService.findAll(user.id, token);
  }

  /**
   * Get budget status with spending calculations
   * Uses optimized v_budget_status view
   */
  @Get('status')
  async getBudgetStatus(
    @CurrentUser() user: User,
    @Req() request: Request,
  ): Promise<BudgetStatusResponse[]> {
    const token = extractToken(request);
    return this.budgetsService.getBudgetStatus(user.id, token);
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<Budget> {
    const token = extractToken(request);
    return this.budgetsService.findOne(user.id, id, token);
  }

  @Post()
  async create(
    @CurrentUser() user: User,
    @Body() createData: CreateBudgetDto,
    @Req() request: Request,
  ): Promise<Budget> {
    const token = extractToken(request);
    return this.budgetsService.create(user.id, createData, token);
  }

  @Put(':id')
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateData: UpdateBudgetDto,
    @Req() request: Request,
  ): Promise<Budget> {
    const token = extractToken(request);
    return this.budgetsService.update(user.id, id, updateData, token);
  }

  @Delete(':id')
  async remove(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<Budget> {
    const token = extractToken(request);
    return this.budgetsService.remove(user.id, id, token);
  }

  /**
   * Renew an expired budget - creates a new budget for the next period
   */
  @Post(':id/renew')
  async renew(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<Budget> {
    const token = extractToken(request);
    return this.budgetsService.renewBudget(user.id, id, token);
  }
}
