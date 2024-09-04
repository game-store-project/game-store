'use client';

import { setCartToken } from '@/actions/headers';
import { IGame } from '@/dtos/game';
import { useCart } from '@/hooks/use-cart';
import { api } from '@/lib/api';
import { formatPrice } from '@/utils/price';
import { AxiosError } from 'axios';
import { ChevronRight, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { CardGame } from './card-game';
import { Loading } from './ui/loading';

interface HomeGames {
  highlights: IGame[];
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

  const [currentIndex, setCurrentIndex] = useState(0);

  const { loadCartData } = useCart();

  const fetchGames = useCallback(async () => {
    try {
      const response = await api.get('/index');

      setGames({
        highlights: response.data.highlights,
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % games.highlights?.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [games.highlights?.length]);

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
      <div className="flex h-full">
        <Loading />;
      </div>
    );
  }

  return (
    <main className="mx-auto mt-8 w-full max-w-[1260px] space-y-24">
      <div className="px-6">
        <h1 className="text-xl">EM DESTAQUE</h1>
        <div className="mt-2 flex flex-wrap justify-center gap-3 xl:gap-10">
          <div className="relative">
            <Link href={`/${games.highlights[currentIndex]?.slug}`}>
              <Image
                src={`${process.env.NEXT_PUBLIC_URL_API}/${games.highlights[currentIndex]?.imageUrl}`}
                className="rounded-xl transition-all duration-300"
                data-current={currentIndex}
                alt={games.highlights[currentIndex]?.slug as string}
                width={846}
                height={475}
              />
            </Link>

            <button
              className="bg-border/70 hover:bg-destructive hover:border-destructive absolute bottom-5 right-5 z-10 mx-auto mt-5 flex h-9 w-full max-w-40 items-center justify-center gap-2 rounded-lg border border-gray-800 px-4 font-medium transition-colors duration-500"
              onClick={(e) =>
                handleAddToCart(e, games.highlights[currentIndex]?.id as string)
              }
            >
              <ShoppingCart className="size-5" />
              {formatPrice(games.highlights[currentIndex]?.price as number)}
            </button>
          </div>
          <div className="flex min-w-[326px] justify-between sm:gap-4 xl:flex-1 xl:flex-col">
            {games.highlights.map((game, index) => (
              <button
                className="data-[current=true]:bg-secondary flex w-full flex-col items-center gap-2 rounded-xl p-1.5 transition-all duration-300 sm:p-4 xl:flex-row"
                key={game.id}
                data-current={index === currentIndex}
                onClick={() => setCurrentIndex(index)}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_URL_API}/${game.imageUrl}`}
                  className="rounded-lg"
                  alt={game.slug}
                  quality={30}
                  width={133}
                  height={110}
                />
                <h3 className="hidden text-start font-normal sm:block">
                  {game.title.length > 35
                    ? game.title.slice(0, 25).concat('...')
                    : game.title}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <Link
          className="mx-6 flex items-center text-xl transition-all hover:underline"
          href="/results?filter=new-releases"
        >
          NOVOS LANÇAMENTOS
          <ChevronRight className="size-6" />
        </Link>
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
        <Link
          className="mx-6 flex items-center text-xl transition-all hover:underline"
          href="/results?filter=recommended"
        >
          RECOMENDADOS PARA VOCÊ
          <ChevronRight className="size-6" />
        </Link>
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
        <Link
          className="mx-6 flex items-center text-xl transition-all hover:underline"
          href="/results?filter=best-sellers"
        >
          MAIS VENDIDOS
          <ChevronRight className="size-6" />
        </Link>
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
    </main>
  );
};
