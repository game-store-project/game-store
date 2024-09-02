'use client';

import { deleteCartItems, getCartToken } from '@/actions/headers';
import { api } from '@/lib/api';
import { AxiosError } from 'axios';
import { ReactNode, createContext, useCallback, useEffect, useState } from 'react';

export interface ICart {
  id: string;
  title: string;
  year: number;
  price: number;
  imageUrl: string;
  slug: string;
}

export interface CartContextProps {
  cartItems: ICart[];
  setCartItems: (cartItems: ICart[]) => void;
  loadCartData: () => Promise<void>;
  clearCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextProps>({} as CartContextProps);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<ICart[]>([]);

  const clearCart = useCallback(async () => {
    await deleteCartItems();
    setCartItems([]);
  }, []);

  const loadCartData = useCallback(async () => {
    const cartToken = await getCartToken();

    if (cartToken) {
      try {
        const response = await api.get('/cart');

        setCartItems(response.data.cartItems);
      } catch (error) {
        if (error instanceof AxiosError) {
          await clearCart();
        }
      }
    }
  }, [clearCart]);

  useEffect(() => {
    loadCartData();
  }, [loadCartData]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        loadCartData,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
