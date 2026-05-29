import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Cart, CartItem } from '@/types';
import { cartService } from '@/services/cartService';

interface CartState {
  cart: Cart | null;
  isOpen: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  isOpen: false,
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk('cart/fetch', async () => {
  const res = await cartService.getCart();
  return res.data.data.cart;
});

export const addToCart = createAsyncThunk(
  'cart/add',
  async (data: { productId: string; quantity: number; size: string; color: string }) => {
    const res = await cartService.addToCart(data);
    return res.data.data.cart;
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/update',
  async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
    const res = await cartService.updateItem(itemId, quantity);
    return res.data.data.cart;
  }
);

export const removeFromCart = createAsyncThunk('cart/remove', async (itemId: string) => {
  const res = await cartService.removeItem(itemId);
  return res.data.data.cart;
});

export const clearCart = createAsyncThunk('cart/clear', async () => {
  await cartService.clearCart();
  return null;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    openCart: (state) => { state.isOpen = true; },
    closeCart: (state) => { state.isOpen = false; },
    toggleCart: (state) => { state.isOpen = !state.isOpen; },
    setCart: (state, action: PayloadAction<Cart>) => { state.cart = action.payload; },
    resetCart: (state) => { state.cart = null; },
  },
  extraReducers: (builder) => {
    const setLoading = (state: CartState) => { state.loading = true; state.error = null; };
    const setError = (state: CartState, action: PayloadAction<unknown>) => {
      state.loading = false;
      state.error = (action.payload as { message: string }).message || 'An error occurred';
    };
    const setCart = (state: CartState, action: PayloadAction<Cart>) => {
      state.loading = false;
      state.cart = action.payload;
    };

    builder
      .addCase(fetchCart.pending, setLoading)
      .addCase(fetchCart.fulfilled, setCart)
      .addCase(fetchCart.rejected, setError)
      .addCase(addToCart.pending, setLoading)
      .addCase(addToCart.fulfilled, setCart)
      .addCase(addToCart.rejected, setError)
      .addCase(updateCartItem.pending, setLoading)
      .addCase(updateCartItem.fulfilled, setCart)
      .addCase(updateCartItem.rejected, setError)
      .addCase(removeFromCart.pending, setLoading)
      .addCase(removeFromCart.fulfilled, setCart)
      .addCase(removeFromCart.rejected, setError)
      .addCase(clearCart.fulfilled, (state) => { state.cart = null; state.loading = false; });
  },
});

export const { openCart, closeCart, toggleCart, setCart, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
