import { hasAuthToken } from '@/actions/headers';
import { UsersDashboard } from '@/components/users-dashboard';
import { notFound } from 'next/navigation';

export default async function Users() {
  const authToken = await hasAuthToken();

  if (!authToken) {
    notFound();
  }

  return <UsersDashboard />;
}
