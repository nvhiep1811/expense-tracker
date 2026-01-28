import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsUUID,
  IsDateString,
  IsEnum,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum BudgetPeriod {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export class CreateBudgetDto {
  @IsNotEmpty({ message: 'Danh mục không được để trống' })
  @IsUUID('4', { message: 'ID danh mục không hợp lệ' })
  category_id: string;

  @IsNotEmpty({ message: 'Kỳ hạn không được để trống' })
  @IsEnum(BudgetPeriod, { message: 'Kỳ hạn không hợp lệ' })
  period: BudgetPeriod;

  @IsNotEmpty({ message: 'Ngày bắt đầu không được để trống' })
  @IsDateString({}, { message: 'Ngày bắt đầu không hợp lệ' })
  start_date: string;

  @IsNotEmpty({ message: 'Ngày kết thúc không được để trống' })
  @IsDateString({}, { message: 'Ngày kết thúc không hợp lệ' })
  end_date: string;

  @IsNumber({}, { message: 'Số tiền phải là số' })
  @Type(() => Number)
  @Min(0, { message: 'Số tiền không được âm' })
  limit_amount: number;

  @IsOptional()
  @IsNumber({}, { message: 'Ngưỡng cảnh báo phải là số' })
  @Type(() => Number)
  @Min(1, { message: 'Ngưỡng cảnh báo phải từ 1-100' })
  @Max(100, { message: 'Ngưỡng cảnh báo phải từ 1-100' })
  alert_threshold_pct?: number;

  @IsOptional()
  @IsBoolean({ message: 'Rollover phải là boolean' })
  rollover?: boolean;
}

export class UpdateBudgetDto {
  @IsOptional()
  @IsUUID('4', { message: 'ID danh mục không hợp lệ' })
  category_id?: string;

  @IsOptional()
  @IsEnum(BudgetPeriod, { message: 'Kỳ hạn không hợp lệ' })
  period?: BudgetPeriod;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày bắt đầu không hợp lệ' })
  start_date?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày kết thúc không hợp lệ' })
  end_date?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Số tiền phải là số' })
  @Type(() => Number)
  @Min(0, { message: 'Số tiền không được âm' })
  limit_amount?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Ngưỡng cảnh báo phải là số' })
  @Type(() => Number)
  @Min(1, { message: 'Ngưỡng cảnh báo phải từ 1-100' })
  @Max(100, { message: 'Ngưỡng cảnh báo phải từ 1-100' })
  alert_threshold_pct?: number;

  @IsOptional()
  @IsBoolean({ message: 'Rollover phải là boolean' })
  rollover?: boolean;
}
