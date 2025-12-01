import { apiClient } from './api-client';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: 'TEACHER' | 'STAFF' | 'ADMIN';
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'TEACHER' | 'STAFF' | 'ADMIN';
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  role?: 'TEACHER' | 'STAFF' | 'ADMIN';
}

class UsersService {
  async list(): Promise<User[]> {
    const response = await apiClient.get<{ users: User[] }>('/users');
    return response.users;
  }

  async create(data: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<{ user: User }>('/users', data);
    return response.user;
  }

  async update(id: string, data: UpdateUserRequest): Promise<User> {
    const response = await apiClient.patch<{ user: User }>(`/users/${id}`, data);
    return response.user;
  }

  async updateProfile(data: UpdateUserRequest): Promise<User> {
    const response = await apiClient.patch<{ user: User }>('/users/me', data);
    return response.user;
  }

  async inactivate(id: string): Promise<void> {
    await apiClient.patch(`/users/inactivate/${id}`);
  }
}

export const usersService = new UsersService();
