import api from './api';

export const cartService = {
  getCart: () => api.get('/cart'),
  addToCart: (data: { productId: string; quantity: number; size: string; color: string }) =>
    api.post('/cart/add', data),
  updateItem: (itemId: string, quantity: number) =>
    api.patch(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId: string) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart'),
};
