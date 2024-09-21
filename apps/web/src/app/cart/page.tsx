import { Cart } from '@/components/cart';
import { Header } from '@/components/header';
import { Main } from '@/components/main';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carrinho | GameStore',
};

export default async function CartPage() {
  return (
    <Main>
      <Header />
      <Cart />
    </Main>
  );
}
