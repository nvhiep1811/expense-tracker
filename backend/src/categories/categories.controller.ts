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
import { CategoriesService } from './categories.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import type { Request } from 'express';
import { extractToken } from '../common/utils/token.utils';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import type { User, Category } from '../common/types/entities';

@Controller('categories')
@UseGuards(AuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(
    @CurrentUser() user: User,
    @Req() request: Request,
  ): Promise<Category[]> {
    const token = extractToken(request);
    return this.categoriesService.findAll(user.id, token);
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<Category> {
    const token = extractToken(request);
    return this.categoriesService.findOne(user.id, id, token);
  }

  @Post()
  async create(
    @CurrentUser() user: User,
    @Body() createData: CreateCategoryDto,
    @Req() request: Request,
  ): Promise<Category> {
    const token = extractToken(request);
    return this.categoriesService.create(user.id, createData, token);
  }

  @Put(':id')
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateData: UpdateCategoryDto,
    @Req() request: Request,
  ): Promise<Category> {
    const token = extractToken(request);
    return this.categoriesService.update(user.id, id, updateData, token);
  }

  @Delete(':id')
  async remove(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<Category> {
    const token = extractToken(request);
    return this.categoriesService.remove(user.id, id, token);
  }
}
