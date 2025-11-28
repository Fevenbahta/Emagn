import { apiService } from './api';
import { TokenService } from './tokenService';

export interface ProfileData {
  full_name?: string;
  email?: string;
  phone?: string;
  country?: string;
  company_name?: string;
  business_type?: string;
  business_address?: string;
  bank_account_name?: string;
  bank_name?: string;
  account_number?: string;
  routing_number?: string;
  swift_bic?: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
  status?: number;
}

class ProfileApiService {
  async updateProfile(profileData: ProfileData): Promise<ApiResponse<any>> {
    return apiService.put('/api/update', profileData);
  }

  async getProfile(): Promise<ApiResponse<any>> {
    return apiService.get('/api/profile');
  }
}

export const profileApiService = new ProfileApiService();