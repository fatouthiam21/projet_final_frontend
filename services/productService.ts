import api from './api';
import { Product, ProductFilters, PaginatedResponse, ApiResponse } from '@/types';

export const productService = {
  getProducts: (filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    return api.get<PaginatedResponse<Product[]>>(`/products?${params}`);
  },

  getProduct: (id: string) => api.get<ApiResponse<{ product: Product; related: Product[] }>>(`/products/${id}`),

  getFeatured: () => api.get<ApiResponse<{ products: Product[] }>>('/products/featured'),

  getNewArrivals: () => api.get<ApiResponse<{ products: Product[] }>>('/products/new-arrivals'),

  getOnSale: () => api.get<ApiResponse<{ products: Product[] }>>('/products/on-sale'),

  search: (q: string, limit?: number) =>
    api.get<ApiResponse<{ products: Product[]; total: number }>>(`/products/search?q=${q}&limit=${limit || 10}`),

  create: (data: FormData | object) => api.post('/products', data),

  update: (id: string, data: object) => api.patch(`/products/${id}`, data),

  delete: (id: string) => api.delete(`/products/${id}`),

  uploadImages: (id: string, formData: FormData) =>
    api.post(`/products/${id}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),

  deleteImage: (id: string, publicId: string) => api.delete(`/products/${id}/images`, { data: { publicId } }),
};
