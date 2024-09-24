import { hasAuthToken } from '@/actions/headers';
import { Header } from '@/components/header';
import { Main } from '@/components/main';
import { Profile } from '@/components/profile';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'User | GameStore',
};

export interface ProfileParams {
  params: {
    profile: string;
  };
}

export default async function ProfilePage({ params }: ProfileParams) {
  metadata.title = `${params.profile} | GameStore`;

  const authToken = await hasAuthToken();

  if (!authToken) {
    notFound();
  }

  return (
    <Main>
      <Header />
      <Profile params={params} />
    </Main>
  );
}
