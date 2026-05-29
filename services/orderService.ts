import api from './api';

export const orderService = {
  createOrder: (data: object) => api.post('/orders', data),
  getMyOrders: (page = 1) => api.get(`/orders/my-orders?page=${page}`),
  getOrder: (id: string) => api.get(`/orders/my-orders/${id}`),
  getAllOrders: (params?: object) => api.get('/orders', { params }),
  updateStatus: (id: string, data: object) => api.patch(`/orders/${id}/status`, data),
  initializePayment: (orderId: string) => api.post(`/payments/initialize/${orderId}`),
  verifyPayment: (token: string) => api.get(`/payments/verify/${token}`),
};
