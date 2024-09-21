import { hasAuthToken } from '@/actions/headers';
import { Tabs } from '@/components/tabs';
import { UsersDashboard } from '@/components/users-dashboard';
import { notFound } from 'next/navigation';

export default async function UsersDashboardPage() {
  const authToken = await hasAuthToken();

  if (!authToken) {
    notFound();
  }

  return (
    <>
      <Tabs />
      <UsersDashboard />
    </>
  );
}
