export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'client' | 'admin';
  addresses: Address[];
  wishlist: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Address {
  _id: string;
  label: string;
  street: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  isDefault: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  productCount: number;
  isActive: boolean;
}

export interface ProductVariant {
  _id: string;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
  sku?: string;
}

export interface ProductImage {
  url: string;
  publicId: string;
  alt: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  discountPercentage: number;
  category: Category;
  brand: string;
  images: ProductImage[];
  variants: ProductVariant[];
  tags: string[];
  type: 'clothing' | 'shoes' | 'accessory';
  gender: 'men' | 'women' | 'unisex';
  averageRating: number;
  totalReviews: number;
  salesCount: number;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isOnSale: boolean;
  totalStock: number;
  isInStock: boolean;
  createdAt: string;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  size: string;
  color: string;
  price: number;
  name: string;
  image: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  discount: number;
  totalItems: number;
  subtotal: number;
  total: number;
}

export interface OrderItem {
  product: string | Product;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

export interface TrackingEvent {
  status: string;
  message: string;
  timestamp: string;
  location?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string | User;
  items: OrderItem[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    country: string;
  };
  paymentMethod: 'paydunya' | 'cash_on_delivery';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  notes?: string;
  tracking: TrackingEvent[];
  createdAt: string;
  deliveredAt?: string;
}

export interface Review {
  _id: string;
  product: string;
  user: User;
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  onSale?: boolean;
}

export interface DashboardStats {
  orders: { total: number; thisMonth: number; growth: number; pending: number };
  revenue: { total: number; thisMonth: number; growth: number };
  users: { total: number; thisMonth: number };
  products: { total: number; lowStock: unknown[] };
  recentOrders: Order[];
}
