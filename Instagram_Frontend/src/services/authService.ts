import api from './api';
import { LoginRequest, RegisterRequest, AuthResponse, UserData } from '../types';
import { userService } from './userService';

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/users/login', credentials);
    const userData = response.data;
    localStorage.setItem('token', 'dummy-token'); // Replace with actual token when implementing JWT
    localStorage.setItem('userId', userData.id.toString());
    return userData;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/users/create', userData);
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  async getCurrentUser(): Promise<UserData | null> {
    const userId = localStorage.getItem('userId');
    if (!userId) return null;

    try {
      // Fetch the full user data
      const user = await userService.getUserById(parseInt(userId));
      return user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('userId');
  }
}

export const authService = new AuthService(); 