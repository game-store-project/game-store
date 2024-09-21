'use client';

import { deleteCartItems, getCartToken, setCartToken } from '@/actions/headers';
import { ICart } from '@/dtos/cart';
import { api } from '@/lib/api';
import { AxiosError } from 'axios';
import { ReactNode, createContext, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface CartContextProps {
  cartItems: ICart[];
  setCartItems: (cartItems: ICart[]) => void;
  loadCartData: () => Promise<void>;
  addToCart: (id: string) => Promise<void>;
  removeCartItem: (id: string) => Promise<void>;
  buyCartItems: () => Promise<void>;
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

        setCartItems(response.data.cartItems || []);
      } catch (error) {
        if (error instanceof AxiosError) {
          await clearCart();
        }
      }
    }
  }, [clearCart]);

  const removeCartItem = async (id: string) => {
    try {
      const response = await api.delete<{ cartItems: string }>(`/cart/${id}`);

      await setCartToken(response.data.cartItems);
      await loadCartData();
      toast.info('Item removido do carrinho!');
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage: string | [] = error.response?.data.error;

        if (errorMessage === 'Content not found') {
          toast.error('Conteúdo não encontrado.');
        }

        if (errorMessage === 'Internal server error') {
          toast.error('Ocorreu um erro interno no serviço da aplicação.');
        }
      }
      console.error('Erro ao remover item do carrinho', error);
    }
  };

  const addToCart = async (id: string) => {
    try {
      const response = await api.put(`/cart/${id}`);

      await setCartToken(response.data.cartItems);

      await loadCartData();

      toast.success('Item adicionado ao carrinho.');
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage: string | [] = error.response?.data.error;

        if (errorMessage === 'Item is already on the cart') {
          toast.error('Este item já está no carrinho.');
        }

        if (errorMessage === 'Internal server error') {
          toast.error('Ocorreu um interno no serviço da aplicação.');
        }
      }
    }
  };

  const buyCartItems = async () => {
    try {
      const response = await api.post('/cart/buy', {});

      const notAdded = response.data.notAdded;

      if (notAdded?.length) {
        toast.error(
          `Alguns itens não comprados pois já estavam na sua biblioteca, ${notAdded.join(', ')}.`,
        );
      } else {
        toast.success('Compra realizada com sucesso!');
      }

      await clearCart();
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage: string | [] = error.response?.data.error;

        if (errorMessage === 'Internal server error') {
          toast.error('Ocorreu um interno no serviço da aplicação.');
        }
      }
    }
  };

  useEffect(() => {
    loadCartData();
  }, [loadCartData]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        loadCartData,
        buyCartItems,
        addToCart,
        removeCartItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
