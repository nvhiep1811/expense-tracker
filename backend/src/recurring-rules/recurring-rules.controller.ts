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
import { RecurringRulesService } from './recurring-rules.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import type { Request } from 'express';
import { extractToken } from '../common/utils/token.utils';
import {
  CreateRecurringRuleDto,
  UpdateRecurringRuleDto,
} from './dto/recurring-rule.dto';
import type { User, RecurringRule } from '../common/types/entities';

@Controller('recurring-rules')
@UseGuards(AuthGuard)
export class RecurringRulesController {
  constructor(private readonly recurringRulesService: RecurringRulesService) {}

  @Get()
  async findAll(
    @CurrentUser() user: User,
    @Req() request: Request,
  ): Promise<RecurringRule[]> {
    const token = extractToken(request);
    return this.recurringRulesService.findAll(user.id, token);
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<RecurringRule> {
    const token = extractToken(request);
    return this.recurringRulesService.findOne(user.id, id, token);
  }

  @Post()
  async create(
    @CurrentUser() user: User,
    @Body() createData: CreateRecurringRuleDto,
    @Req() request: Request,
  ): Promise<RecurringRule> {
    const token = extractToken(request);
    return this.recurringRulesService.create(user.id, createData, token);
  }

  @Put(':id')
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateData: UpdateRecurringRuleDto,
    @Req() request: Request,
  ): Promise<RecurringRule> {
    const token = extractToken(request);
    return this.recurringRulesService.update(user.id, id, updateData, token);
  }

  @Delete(':id')
  async remove(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<RecurringRule> {
    const token = extractToken(request);
    return this.recurringRulesService.remove(user.id, id, token);
  }
}
