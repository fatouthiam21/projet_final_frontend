import api from './api';
import { User, ApiResponse } from '@/types';

interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  register: (data: { firstName: string; lastName: string; email: string; password: string; phone?: string }) =>
    api.post<ApiResponse<AuthResponse>>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', data),

  getMe: () => api.get<ApiResponse<{ user: User }>>('/auth/me'),

  updateMe: (data: Partial<User>) => api.patch<ApiResponse<{ user: User }>>('/auth/update-me', data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.patch('/auth/change-password', data),

  addAddress: (address: object) => api.post('/auth/addresses', address),

  updateAddress: (id: string, data: object) => api.patch(`/auth/addresses/${id}`, data),

  deleteAddress: (id: string) => api.delete(`/auth/addresses/${id}`),

  toggleWishlist: (productId: string) => api.post(`/auth/wishlist/${productId}`),
};
