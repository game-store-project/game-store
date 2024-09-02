'use client';

import { IGame } from '@/dtos/game';
import { api } from '@/lib/api';
import { AxiosError } from 'axios';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { CardGame } from './card-game';
import { Loading } from './ui/loading';

interface HomeGames {
  newReleases: IGame[];
  recommended: IGame[];
  bestSellers: IGame[];
}

export const Home = () => {
  const [games, setGames] = useState<HomeGames>({} as HomeGames);

  const [isLoading, setIsLoading] = useState(true);

  const newReleasesRef = useRef<HTMLDivElement>(null);
  const recommendedRef = useRef<HTMLDivElement>(null);
  const bestSellersRef = useRef<HTMLDivElement>(null);

  const fetchGames = useCallback(async () => {
    try {
      const response = await api.get('/index');

      setGames({
        newReleases: response.data.newReleases,
        recommended: response.data.recommended,
        bestSellers: response.data.bestSellers,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage: string | [] = error.response?.data.error;

        if (errorMessage === 'Internal server error') {
          toast.error('Ocorreu um interno no serviço da aplicação.');
        }
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) {
      fetchGames();
    }
  }, [fetchGames, isLoading]);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    console.log(id);
  };

  const scrollLeft = (ref: RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: -ref.current.clientWidth * 0.3,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = (ref: RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: ref.current.clientWidth * 0.3,
        behavior: 'smooth',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center">
        <Loading />;
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 w-full max-w-[1260px] space-y-24">
      <div className="mx-6">
        <h1 className="text-xl">EM DESTAQUE</h1>
        <div className="flex"></div>
      </div>
      <div>
        <h1 className="mx-6 text-xl">NOVOS LANÇAMENTOS {'>'}</h1>
        <div className="relative mt-2 flex items-center">
          <button
            className="absolute left-0 z-10 rounded-r-full bg-black/70 px-1 py-6 shadow-black transition-all duration-300 hover:bg-black/90 hover:px-3 hover:shadow-lg min-[1260px]:hidden"
            onClick={() => scrollLeft(newReleasesRef)}
          >
            {'<'}
          </button>
          <div className="mt-2 flex gap-3 overflow-x-hidden px-6" ref={newReleasesRef}>
            {games.newReleases.map((game) => (
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
          <button
            className="absolute right-0 z-10 rounded-l-full bg-black/70 px-1 py-6 shadow-black transition-all duration-300 hover:bg-black/90 hover:px-3 hover:shadow-lg min-[1260px]:hidden"
            onClick={() => scrollRight(newReleasesRef)}
          >
            {'>'}
          </button>
        </div>
      </div>
      <div>
        <h1 className="mx-6 text-xl">RECOMENDADOS PARA VOCÊ {'>'}</h1>
        <div className="relative mt-2 flex items-center">
          <button
            className="absolute left-0 z-10 rounded-r-full bg-black/70 px-1 py-6 shadow-black transition-all duration-300 hover:bg-black/90 hover:px-3 hover:shadow-lg min-[1260px]:hidden"
            onClick={() => scrollLeft(recommendedRef)}
          >
            {'<'}
          </button>
          <div className="mt-2 flex gap-3 overflow-x-hidden px-6" ref={recommendedRef}>
            {games.recommended.map((game) => (
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
          <button
            className="absolute right-0 z-10 rounded-l-full bg-black/70 px-1 py-6 shadow-black transition-all duration-300 hover:bg-black/90 hover:px-3 hover:shadow-lg min-[1260px]:hidden"
            onClick={() => scrollRight(recommendedRef)}
          >
            {'>'}
          </button>
        </div>
      </div>
      <div>
        <h1 className="mx-6 text-xl">MAIS VENDIDOS {'>'}</h1>
        <div className="relative mt-2 flex items-center">
          <button
            className="absolute left-0 z-10 rounded-r-full bg-black/70 px-1 py-6 shadow-black transition-all duration-300 hover:bg-black/90 hover:px-3 hover:shadow-lg min-[1260px]:hidden"
            onClick={() => scrollLeft(bestSellersRef)}
          >
            {'<'}
          </button>
          <div className="mt-2 flex gap-3 overflow-x-hidden px-6" ref={bestSellersRef}>
            {games.bestSellers.map((game) => (
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
          <button
            className="absolute right-0 z-10 rounded-l-full bg-black/70 px-1 py-6 shadow-black transition-all duration-300 hover:bg-black/90 hover:px-3 hover:shadow-lg min-[1260px]:hidden"
            onClick={() => scrollRight(bestSellersRef)}
          >
            {'>'}
          </button>
        </div>
      </div>
    </div>
  );
};
