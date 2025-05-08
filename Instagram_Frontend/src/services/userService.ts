import api from './api';
import { UserData } from '../types';

class UserService {
    async getUserById(id: number): Promise<UserData> {
        const response = await api.get<UserData>(`/users/get/${id}`);
        return response.data;
    }

    async updateUser(id: number, userData: UserData): Promise<UserData> {
        const response = await api.put<UserData>(`/users/update/${id}`, userData);
        return response.data;
    }

    async getAllUsers(): Promise<UserData[]> {
        const response = await api.get<UserData[]>('/users/getAll');
        return response.data;
    }
}

export const userService = new UserService(); 