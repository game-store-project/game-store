import { CartContext } from '@/contexts/cart';
import { useContext } from 'react';

export const useCart = () => {
  const context = useContext(CartContext);

  return context;
};
