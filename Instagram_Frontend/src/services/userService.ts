import api from './api';
import { UserData } from '../types';

class UserService {
    async getUserById(id: number): Promise<UserData> {
        const response = await api.get(`/users/get/${id}`);
        return response.data;
    }

    async updateUser(id: number, userData: Partial<UserData>): Promise<UserData> {
        const response = await api.put(`/users/update/${id}`, userData);
        return response.data;
    }

    async getAllUsers(): Promise<UserData[]> {
        const response = await api.get<UserData[]>('/users/getAll');
        return response.data;
    }

    async updateProfilePicture(userId: number, formData: FormData): Promise<UserData> {
        const response = await api.post(`/users/${userId}/profile-picture`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
}

export const userService = new UserService(); 