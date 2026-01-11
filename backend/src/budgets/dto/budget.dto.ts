import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsUUID,
  IsDateString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBudgetDto {
  @IsNotEmpty({ message: 'Tên ngân sách không được để trống' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Danh mục không được để trống' })
  @IsUUID('4', { message: 'ID danh mục không hợp lệ' })
  category_id: string;

  @IsNumber({}, { message: 'Số tiền phải là số' })
  @Type(() => Number)
  @Min(0.01, { message: 'Số tiền phải lớn hơn 0' })
  amount: number;

  @IsNotEmpty({ message: 'Ngày bắt đầu không được để trống' })
  @IsDateString({}, { message: 'Ngày bắt đầu không hợp lệ' })
  start_date: string;

  @IsNotEmpty({ message: 'Ngày kết thúc không được để trống' })
  @IsDateString({}, { message: 'Ngày kết thúc không hợp lệ' })
  end_date: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateBudgetDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUUID('4', { message: 'ID danh mục không hợp lệ' })
  category_id?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Số tiền phải là số' })
  @Type(() => Number)
  @Min(0.01, { message: 'Số tiền phải lớn hơn 0' })
  amount?: number;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày bắt đầu không hợp lệ' })
  start_date?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày kết thúc không hợp lệ' })
  end_date?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
