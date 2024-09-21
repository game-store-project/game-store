import { hasAuthToken } from '@/actions/headers';
import { GenresDashboard } from '@/components/genres-dashboard';
import { Tabs } from '@/components/tabs';
import { notFound } from 'next/navigation';

export default async function GenresDashboardPage() {
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
