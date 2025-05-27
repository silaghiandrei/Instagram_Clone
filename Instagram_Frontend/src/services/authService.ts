import api from './api';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types';

class AuthService {
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/users/login', data);
      
      if (!response.data) {
        throw new Error('Invalid response from server');
      }
      
      if (!response.data.id) {
        throw new Error('Invalid response from server');
      }
      
      localStorage.setItem('userId', response.data.id.toString());
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('email', response.data.email);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/users/create', data);
      
      if (!response.data || !response.data.id) {
        throw new Error('Invalid response from server');
      }
      
      localStorage.setItem('userId', response.data.id.toString());
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('email', response.data.email);
      return response.data;
    } catch (error: any) {
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