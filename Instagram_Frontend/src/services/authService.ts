import api from './api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
}

class AuthService {
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('Sending login request with data:', data);
      const response = await api.post<AuthResponse>('/users/login', data);
      console.log('Login response:', response);
      
      if (!response.data) {
        console.error('No data in response');
        throw new Error('Invalid response from server');
      }
      
      if (!response.data.id) {
        console.error('No id in response data:', response.data);
        throw new Error('Invalid response from server');
      }
      
      localStorage.setItem('userId', response.data.id.toString());
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('email', response.data.email);
      return response.data;
    } catch (error: any) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('Sending register request with data:', data);
      const response = await api.post<AuthResponse>('/users/create', data);
      console.log('Register response:', response);
      
      if (!response.data || !response.data.id) {
        console.error('Invalid register response:', response);
        throw new Error('Invalid response from server');
      }
      
      localStorage.setItem('userId', response.data.id.toString());
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('email', response.data.email);
      return response.data;
    } catch (error: any) {
      console.error('Registration error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  }

  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
  }

  getCurrentUser(): AuthResponse | null {
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    
    if (!userId || !username || !email) return null;
    
    return {
      id: parseInt(userId),
      username,
      email
    };
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('userId');
  }
}

export const authService = new AuthService(); 