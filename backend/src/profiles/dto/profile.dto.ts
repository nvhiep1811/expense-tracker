import { IsString, IsOptional, IsEmail, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  avatar_url?: string;
}

export class ChangeEmailDto {
  @IsEmail()
  new_email: string;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  current_password: string;

  @IsString()
  @MinLength(6)
  new_password: string;
}

export class UploadAvatarDto {
  @IsString()
  file_name: string;

  @IsString()
  file_type: string;

  @IsString()
  base64_data: string;
}
