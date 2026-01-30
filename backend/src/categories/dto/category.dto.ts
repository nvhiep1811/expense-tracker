import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum CategorySide {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Loại danh mục không được để trống' })
  @IsEnum(CategorySide, { message: 'Loại danh mục không hợp lệ' })
  side: CategorySide;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  color?: string;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(CategorySide, { message: 'Loại danh mục không hợp lệ' })
  side?: CategorySide;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  color?: string;
}
