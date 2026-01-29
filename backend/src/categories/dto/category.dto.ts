import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum CategoryType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Loại danh mục không được để trống' })
  @IsEnum(CategoryType, { message: 'Loại danh mục không hợp lệ' })
  type: CategoryType;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(CategoryType, { message: 'Loại danh mục không hợp lệ' })
  type?: CategoryType;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
