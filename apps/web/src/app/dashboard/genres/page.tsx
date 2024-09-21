import { hasAuthToken } from '@/actions/headers';
import { GenresDashboard } from '@/components/genres-dashboard';
import { Tabs } from '@/components/tabs';
import { notFound } from 'next/navigation';

export default async function Genres() {
  const authToken = await hasAuthToken();

  if (!authToken) {
    notFound();
  }

  return (
    <>
      <Tabs />
      <GenresDashboard />
    </>
  );
}
