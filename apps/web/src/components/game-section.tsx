'use client';

import { IGame } from '@/dtos/game';
import { useCart } from '@/hooks/use-cart';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { RefObject, useRef } from 'react';
import { CardGame } from './card-game';

interface GameSectionProps {
  title: string;
  games: IGame[];
  filter?: string;
}

export const GameSection = ({ title, filter, games }: GameSectionProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

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

  return (
    <div className="space-y-2">
      <div className="mx-6 text-xl">
        {filter ? (
          <Link
            className="flex items-center transition-all hover:underline"
            href={`/results?filter=${filter}`}
          >
            {title}
            <ChevronRight className="size-6" />
          </Link>
        ) : (
          <h1>{title}</h1>
        )}
      </div>
      <div className="relative flex items-center">
        {games.length > 2 && (
          <button
            className="absolute left-0 z-10 rounded-r-full bg-black/70 px-1 py-6 shadow-black transition-all duration-300 hover:bg-black/90 hover:px-3 hover:shadow-lg data-[length=true]:block min-[1260px]:hidden"
            data-length={games.length > 6 ? true : false}
            onClick={() => scrollLeft(divRef)}
          >
            {'<'}
          </button>
        )}
        <div className="mt-2 flex gap-3 overflow-x-hidden px-6" ref={divRef}>
          {games.map((game) => (
            <CardGame
              key={game.id}
              title={game.title}
              slug={game.slug}
              price={game.price}
              year={game.year}
              imageUrl={game.imageUrl}
              onClick={(e) => {
                e.preventDefault();
                addToCart(game.id);
              }}
            />
          ))}
        </div>
        {games.length > 2 && (
          <button
            className="absolute right-0 z-10 rounded-l-full bg-black/70 px-1 py-6 shadow-black transition-all duration-300 hover:bg-black/90 hover:px-3 hover:shadow-lg data-[length=true]:block min-[1260px]:hidden"
            data-length={games.length > 6 ? true : false}
            onClick={() => scrollRight(divRef)}
          >
            {'>'}
          </button>
        )}
      </div>
    </div>
  );
};
