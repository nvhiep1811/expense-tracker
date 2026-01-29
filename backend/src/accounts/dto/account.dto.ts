import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum AccountType {
  CASH = 'cash',
  BANK = 'bank',
  E_WALLET = 'e_wallet',
}

export class CreateAccountDto {
  @IsNotEmpty({ message: 'Tên tài khoản không được để trống' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Loại tài khoản không được để trống' })
  @IsEnum(AccountType, { message: 'Loại tài khoản không hợp lệ' })
  type: AccountType;

  @IsNumber({}, { message: 'Số dư phải là số' })
  @Type(() => Number)
  @Min(0, { message: 'Số dư không được âm' })
  opening_balance: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  color?: string;
}

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(AccountType, { message: 'Loại tài khoản không hợp lệ' })
  type?: AccountType;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsBoolean()
  is_archived?: boolean;
}
