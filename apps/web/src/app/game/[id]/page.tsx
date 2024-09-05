import { IGame } from '@/dtos/game';
import { Metadata } from 'next';
import Image from 'next/image';
import { GameInfo } from '../../../components/game-info';
import { ShoppingCartIcon } from '@/components/ui/shopping-cart-icon';
import { formatPrice } from '@/utils/price';
import { Main } from '@/components/main';
import { Header } from '@/components/header';
import { notFound, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { hasAuthToken } from '@/actions/headers';

export const metadata: Metadata = {
  title: 'Game | GameStore',
};

export default function GamePage({ params }: { params: { id: string } }) {
  const [gameData, setGameData] = useState<IGame>();
  const validateAuthToken = async () => {
    const authToken = await hasAuthToken();

    if (authToken) {
      notFound();
    }
  };

  const router = useRouter();

  const getGameData = async () => {
    try {
      const gameData = await api.get<IGame>(`/games/${params.id}`);
      setGameData(gameData);
    } catch (error) {
      console.error('Erro ao enviar os dados', error);
      router.push('/dashboard/games');
    }
  };

  useEffect(() => {
    validateAuthToken();
    getGameData();
  }, [getGameData]);

  return (
    <Main>
      <Header />
      <div className={`flex w-full justify-center bg-[url("/mafiadefinitive.jpg")]`}>
        <div className={`from- flex w-full justify-center bg-gradient-to-t to-blue-500`}>
          <div className="relative mx-auto mt-12 flex w-full max-w-[1260px] flex-col gap-12 px-6">
            <h1 className="text-2xl text-white">{gameData.title.toUpperCase()}</h1>
            <div className="flex gap-12">
              <Image
                src="/mafiadefinitive.jpg"
                alt="mafiadefinitive"
                width={800}
                height={450}
                quality={80}
                className="rounded-xl"
              />
              <div className="flex flex-1 flex-col gap-5">
                <div className="bg-background h-full rounded-xl px-6 py-4">
                  <GameInfo info="Título" value={gameData.title} />
                  <GameInfo info="Gênero" value={gameData.genre?.name} />
                  <GameInfo info="Lançamento" value={gameData.year.toString()} />
                  <GameInfo info="Plataforma" value="Windows" />
                  <GameInfo info="Tipo de ativação" value="Chave de ativação" />
                </div>
                <button className="bg-primary flex w-full items-center justify-center gap-1 rounded-xl py-4">
                  <ShoppingCartIcon />
                  {formatPrice(gameData.price)}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="text-base">SOBRE O JOGO</h2>
              <p>{gameData.description}</p>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
}
