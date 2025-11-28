// CORS proxy solution
const getApiBaseUrl = () => {
  // Use CORS proxy in development
  if (import.meta.env.DEV) {
    // Option 1: corsproxy.io (simple)
    return 'https://corsproxy.io/?' + encodeURIComponent('https://itzel-selenic-hisako.ngrok-free.dev');
    
    // Option 2: cors-anywhere (alternative)
    // return 'https://cors-anywhere.herokuapp.com/https://itzel-selenic-hisako.ngrok-free.dev';
    
    // Option 3: thingproxy (another alternative)
    // return 'https://thingproxy.freeboard.io/fetch/https://itzel-selenic-hisako.ngrok-free.dev';
  }
  return import.meta.env.VITE_API_URL || 'https://itzel-selenic-hisako.ngrok-free.dev';
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
    console.log('🔧 Using CORS proxy:', import.meta.env.DEV);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // For CORS proxy, we need to handle URLs differently
    let url: string;
    
    if (import.meta.env.DEV && this.baseURL.includes('corsproxy')) {
      // When using corsproxy.io, we append the endpoint to the encoded URL
      const baseWithoutProxy = 'https://itzel-selenic-hisako.ngrok-free.dev';
      const fullUrl = `${baseWithoutProxy}${endpoint}`;
      url = `https://corsproxy.io/?${encodeURIComponent(fullUrl)}`;
    } else if (import.meta.env.DEV && this.baseURL.includes('cors-anywhere')) {
      // When using cors-anywhere, append endpoint to base
      url = `${this.baseURL}${endpoint}`;
    } else {
      // Normal URL construction for production
      const cleanBaseURL = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      url = `${cleanBaseURL}${cleanEndpoint}`;
    }
    
    console.log('🔗 Final URL being called:', url);

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    // Only add ngrok headers when not using proxy
    if (!import.meta.env.DEV) {
      headers['ngrok-skip-browser-warning'] = 'true';
    }

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
      return { 
        data, 
        success: true,
        status: response.status
      };
    } catch (error) {
      console.error('💥 Request failed:', error);
      
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      return {
        error: errorMessage,
        success: false,
        status: 0
      };
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