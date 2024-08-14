import { hasAuthToken } from '@/actions/headers';
import { notFound } from 'next/navigation';

export default async function Users() {
  const authToken = await hasAuthToken();

  if (!authToken) {
    notFound();
  }

  return <p>user 1</p>;
}
