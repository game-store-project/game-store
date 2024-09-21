import { Game } from '@/components/game';
import { Header } from '@/components/header';
import { Main } from '@/components/main';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Game | GameStore',
};

export interface GameParams {
  params: {
    slug: string;
  };
}

export default async function GamePage({ params }: GameParams) {
  const title = params.slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  metadata.title = `${title} | GameStore`;

  return (
    <Main>
      <Header />
      <Game params={params} />
    </Main>
  );
}
