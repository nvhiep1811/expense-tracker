import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from '../common/services/base.service';
import { Profile } from '../common/types/entities';
import { UpdateProfileDto } from './dto/profile.dto';

@Injectable()
export class ProfilesService extends BaseService {
  constructor(configService: ConfigService) {
    super(configService);
  }

  async getProfile(userId: string, accessToken: string): Promise<Profile> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data as Profile;
  }

  async updateProfile(
    userId: string,
    updateData: UpdateProfileDto,
    accessToken: string,
  ): Promise<Profile> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  }
}
