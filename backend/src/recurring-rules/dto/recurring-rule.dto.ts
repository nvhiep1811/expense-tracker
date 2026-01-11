import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsUUID,
  IsDateString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType } from '../../transactions/dto/transaction.dto';

export enum RecurrenceFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export class CreateRecurringRuleDto {
  @IsNotEmpty({ message: 'Tên quy tắc không được để trống' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Loại giao dịch không được để trống' })
  @IsEnum(TransactionType, { message: 'Loại giao dịch không hợp lệ' })
  transaction_type: TransactionType;

  @IsNumber({}, { message: 'Số tiền phải là số' })
  @Type(() => Number)
  @Min(0.01, { message: 'Số tiền phải lớn hơn 0' })
  amount: number;

  @IsNotEmpty({ message: 'Tài khoản không được để trống' })
  @IsUUID('4', { message: 'ID tài khoản không hợp lệ' })
  account_id: string;

  @IsNotEmpty({ message: 'Danh mục không được để trống' })
  @IsUUID('4', { message: 'ID danh mục không hợp lệ' })
  category_id: string;

  @IsNotEmpty({ message: 'Tần suất không được để trống' })
  @IsEnum(RecurrenceFrequency, { message: 'Tần suất không hợp lệ' })
  frequency: RecurrenceFrequency;

  @IsNotEmpty({ message: 'Ngày bắt đầu không được để trống' })
  @IsDateString({}, { message: 'Ngày bắt đầu không hợp lệ' })
  start_date: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày kết thúc không hợp lệ' })
  end_date?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateRecurringRuleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(TransactionType, { message: 'Loại giao dịch không hợp lệ' })
  transaction_type?: TransactionType;

  @IsOptional()
  @IsNumber({}, { message: 'Số tiền phải là số' })
  @Type(() => Number)
  @Min(0.01, { message: 'Số tiền phải lớn hơn 0' })
  amount?: number;

  @IsOptional()
  @IsUUID('4', { message: 'ID tài khoản không hợp lệ' })
  account_id?: string;

  @IsOptional()
  @IsUUID('4', { message: 'ID danh mục không hợp lệ' })
  category_id?: string;

  @IsOptional()
  @IsEnum(RecurrenceFrequency, { message: 'Tần suất không hợp lệ' })
  frequency?: RecurrenceFrequency;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày bắt đầu không hợp lệ' })
  start_date?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày kết thúc không hợp lệ' })
  end_date?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
