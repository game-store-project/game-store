import { Header } from '@/components/header';
import { Main } from '@/components/main';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User | GameStore',
};

export interface GameParams {
  params: {
    profile: string;
  };
}

export default async function ProfilePage({ params }: GameParams) {
  metadata.title = `${params.profile} | GameStore`;

  return (
    <Main>
      <Header />
      <h1>{params.profile}</h1>
    </Main>
  );
}
