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
import { PaginationDto } from '../../common/dto/pagination.dto';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
}

export class CreateTransactionDto {
  @IsNotEmpty({ message: 'Loại giao dịch không được để trống' })
  @IsEnum(TransactionType, { message: 'Loại giao dịch không hợp lệ' })
  type: TransactionType;

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

  @IsNotEmpty({ message: 'Ngày giao dịch không được để trống' })
  @IsDateString({}, { message: 'Ngày giao dịch không hợp lệ' })
  occurred_on: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdateTransactionDto {
  @IsOptional()
  @IsEnum(TransactionType, { message: 'Loại giao dịch không hợp lệ' })
  type?: TransactionType;

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
  @IsDateString({}, { message: 'Ngày giao dịch không hợp lệ' })
  occurred_on?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  note?: string;
}

export class TransactionFiltersDto extends PaginationDto {
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @IsUUID('4')
  account_id?: string;

  @IsOptional()
  @IsUUID('4')
  category_id?: string;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
