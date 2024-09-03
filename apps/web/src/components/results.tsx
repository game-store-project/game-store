'use client';

import { setCartToken } from '@/actions/headers';
import { ResultsProps } from '@/app/results/page';
import { IGame } from '@/dtos/game';
import { useCart } from '@/hooks/use-cart';
import { api } from '@/lib/api';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CardGame } from './card-game';
import { Loading } from './ui/loading';

export const Results = ({ searchParams }: ResultsProps) => {
  const [games, setGames] = useState<IGame[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const { loadCartData } = useCart();

  const fetchGames = useCallback(async () => {
    try {
      const response = await api.get(
        `/games/search?search=${searchParams?.search || ''}&filter=${searchParams?.filter || ''}`,
      );

      setGames(response.data.games);
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage: string | [] = error.response?.data.error;

        if (errorMessage === 'Internal server error') {
          toast.error('Ocorreu um interno no serviço da aplicação.');
        }
      }
    }

    setIsLoading(false);
  }, [searchParams?.filter, searchParams?.search]);

  useEffect(() => {
    if (isLoading) {
      fetchGames();
    }
  }, [fetchGames, isLoading]);

  useEffect(() => {
    setIsLoading(true);
  }, [fetchGames, searchParams?.search]);

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();

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

  if (isLoading) {
    return (
      <div className="flex h-full">
        <Loading />;
      </div>
    );
  }

  return (
    <main className="mx-auto mt-8 w-full max-w-[1260px] space-y-24 pb-8">
      <div className="px-6">
        <h1 className="text-xl">Resultados para a busca e filtragem</h1>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          {games.map((game) => (
            <CardGame
              key={game.id}
              title={game.title}
              slug={game.slug}
              price={game.price}
              year={new Date(game.createdAt).getFullYear()}
              imageUrl={game.imageUrl}
              onClick={(e) => handleAddToCart(e, game.id)}
            />
          ))}
        </div>
      </div>
    </main>
  );
};
