import { hasAuthToken } from '@/actions/headers';
import { GamesDashboard } from '@/components/games-dashboard';
import { notFound } from 'next/navigation';

export default async function Games() {
  const authToken = await hasAuthToken();

  if (!authToken) {
    notFound();
  }

  return <GamesDashboard />;
}
