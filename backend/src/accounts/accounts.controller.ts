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
import { AccountsService } from './accounts.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import type { Request } from 'express';
import { extractToken } from '../common/utils/token.utils';
import { CreateAccountDto, UpdateAccountDto } from './dto/account.dto';
import type { User, Account } from '../common/types/entities';

@Controller('accounts')
@UseGuards(AuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  async findAll(
    @CurrentUser() user: User,
    @Req() request: Request,
  ): Promise<Account[]> {
    const token = extractToken(request);
    return this.accountsService.findAll(user.id, token);
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<Account> {
    const token = extractToken(request);
    return this.accountsService.findOne(user.id, id, token);
  }

  @Post()
  async create(
    @CurrentUser() user: User,
    @Body() createData: CreateAccountDto,
    @Req() request: Request,
  ): Promise<Account> {
    const token = extractToken(request);
    return this.accountsService.create(user.id, createData, token);
  }

  @Put(':id')
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateData: UpdateAccountDto,
    @Req() request: Request,
  ): Promise<Account> {
    const token = extractToken(request);
    return this.accountsService.update(user.id, id, updateData, token);
  }

  @Delete(':id')
  async remove(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<Account> {
    const token = extractToken(request);
    return this.accountsService.remove(user.id, id, token);
  }
}
