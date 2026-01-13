// authApi.ts
const getApiBaseUrl = () => {
  // Development: hit backend directly if CORS is enabled
  if (import.meta.env.DEV) {
    return 'https://emagne.onrender.com';
  }
  // Production
  return import.meta.env.VITE_API_URL || 'https://emagne.onrender.com';
};

const API_BASE_URL = getApiBaseUrl();

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  user_type?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  };
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
  status?: number;
}

class AuthApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
    console.log('🎯 API Base URL:', this.baseURL);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const cleanBaseURL = this.baseURL.endsWith('/')
      ? this.baseURL.slice(0, -1)
      : this.baseURL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${cleanBaseURL}${cleanEndpoint}`;

const headers: Record<string, string> = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  ...(options.headers as Record<string, string>), // type assertion
};


    try {
      console.log('🚀 Sending request to:', url);

      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body,
      });

      console.log('📡 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      return { data, success: true, status: response.status };
    } catch (error) {
      console.error('💥 Request failed:', error);

      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) errorMessage = error.message;

      return { error: errorMessage, success: false, status: 0 };
    }
  }

  async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/api/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginData): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }
}

export const authApiService = new AuthApiService();
