'use client';

import { GameParams } from '@/app/[slug]/page';
import { IGame } from '@/dtos/game';
import { api } from '@/lib/api';
import { formatPrice } from '@/utils/price';
import { AxiosError } from 'axios';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { GameInfo } from './game-info';
import { Button } from './ui/button';
import { Loading } from './ui/loading';

export const Game = ({ params }: GameParams) => {
  const [game, setGame] = useState<IGame>({} as IGame);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchGame = useCallback(async () => {
    try {
      const response = await api.get<{ game: IGame }>(`/games/${params.slug}`);
      setGame(response.data.game);
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage: string | [] = error.response?.data.error;

        if (errorMessage === 'Content not found') {
          toast.error('Conteúdo não encontrado.');
          router.push('/dashboard/games');
        }

        if (errorMessage === 'Internal server error') {
          toast.error('Ocorreu um interno no serviço da aplicação.');
        }
      }

      router.push('/');
    } finally {
      setIsLoading(false);
    }
  }, [params.slug, router]);

  useEffect(() => {
    fetchGame();
  }, [fetchGame]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <section>
      <div className="relative">
        <div
          className="before:bg-background/50 before:to-background flex w-full justify-center bg-cover bg-no-repeat before:absolute before:h-full before:w-full before:bg-gradient-to-b before:from-transparent before:to-95%"
          style={{
            backgroundImage: `url(${process.env.NEXT_PUBLIC_URL_API}/${game.imageUrl})`,
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="z-10 mx-auto my-12 flex w-full max-w-[1260px] flex-col gap-3 px-6 sm:gap-9">
            <h1 className="text-2xl font-bold text-white">{game.title?.toUpperCase()}</h1>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-12">
              <Image
                className="size-auto rounded-xl"
                src={`${process.env.NEXT_PUBLIC_URL_API}/${game.imageUrl}`}
                alt={game.title}
                width={800}
                height={450}
                quality={80}
              />
              <div className="flex min-w-80 max-w-[830px] flex-1 flex-col gap-2 sm:gap-5">
                <div className="bg-background h-full space-y-5 rounded-xl px-6 py-4">
                  <GameInfo info="Título" value={game.title} />
                  <GameInfo info="Gênero" value={game.genre?.name} />
                  <GameInfo info="Lançamento" value={game.year?.toString()} />
                  <GameInfo info="Plataforma" value="Windows" />
                  <GameInfo info="Tipo de ativação" value="Chave de ativação" />
                </div>
                <Button className="gap-2">
                  <ShoppingCart />
                  {formatPrice(game.price)}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mb-5 w-full max-w-[1260px] space-y-3 px-6">
        <h2 className="text-lg font-bold">SOBRE O JOGO</h2>
        <p>{game.description}</p>
      </div>
    </section>
  );
};
