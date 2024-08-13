import { hasAuthToken } from '@/actions/headers';
import { IGame } from '@/dtos/game';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { GameInfo } from './components/game-info';
import { ShoppingCartIcon } from '@/components/ui/shopping-cart-icon';
import { formatPrice } from '@/utils/price';

export const metadata: Metadata = {
  title: 'Game | GameStore',
};

export default async function GamePage() {
  const authToken = await hasAuthToken();

  if (authToken) {
    redirect('/');
  }

  //TODO - fetch game data
  const game: IGame = {
    title: 'Mafia: definitive edition',
    year: 2020,
    price: 130,
    id: '436848d1-75d8-474c-b0f7-fff676378508',
    slug: 'mafia-definitive-edition',
    imageUrl: '',
    description: 'Parte um da saga de crimes Mafia: década de 1930, Lost Heaven.',
    disponibility: false,
    createdAt: new Date(),
    genre: {
      id: '436848d1-75d8-474c-b0f7-fff676378509',
      name: 'Aventura',
      createdAt: new Date(),
    },
  };

  return (
    //TODO HEADER BACKGROUND IMAGE
    <div className="flex w-full justify-center">
      <main className="relative mt-12 flex w-full flex-col gap-12">
        <h1 className="text-2xl text-white">{game.title.toUpperCase()}</h1>
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
              <GameInfo info="Título" value={game.title} />
              <GameInfo info="Gênero" value={game.genre.name} />
              <GameInfo info="Lançamento" value={game.year.toString()} />
              <GameInfo info="Plataforma" value="Windows" />
              <GameInfo info="Tipo de ativação" value="Chave de ativação" />
            </div>
            <button className="bg-primary flex w-full items-center justify-center gap-1 rounded-xl py-4">
              <ShoppingCartIcon />
              {formatPrice(game.price)}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-base">SOBRE O JOGO</h2>
          <p>{game.description}</p>
        </div>
      </main>
    </div>
  );
}
