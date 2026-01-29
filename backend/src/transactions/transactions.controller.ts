import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import type { Request } from 'express';
import { extractToken } from '../common/utils/token.utils';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionFiltersDto,
} from './dto/transaction.dto';
import type { User, Transaction } from '../common/types/entities';
import { PaginatedResponse } from '../common/dto/pagination.dto';

@Controller('transactions')
@UseGuards(AuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async findAll(
    @CurrentUser() user: User,
    @Query() filters: TransactionFiltersDto,
    @Req() request: Request,
  ): Promise<PaginatedResponse<Transaction>> {
    const token = extractToken(request);
    return this.transactionsService.findAll(user.id, token, filters);
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<Transaction> {
    const token = extractToken(request);
    return this.transactionsService.findOne(user.id, id, token);
  }

  @Post()
  async create(
    @CurrentUser() user: User,
    @Body() createData: CreateTransactionDto,
    @Req() request: Request,
  ): Promise<Transaction> {
    const token = extractToken(request);
    return this.transactionsService.create(user.id, createData, token);
  }

  @Put(':id')
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateData: UpdateTransactionDto,
    @Req() request: Request,
  ): Promise<Transaction> {
    const token = extractToken(request);
    return this.transactionsService.update(user.id, id, updateData, token);
  }

  @Delete(':id')
  async remove(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<Transaction> {
    const token = extractToken(request);
    return this.transactionsService.remove(user.id, id, token);
  }
}
