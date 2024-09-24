import { hasAuthToken } from '@/actions/headers';
import { EditorForm } from '@/components/editor-form';
import { notFound } from 'next/navigation';

export interface GameParams {
  params?: {
    id: string;
  };
}

export default async function UpdateGamePage({ params }: GameParams) {
  const authToken = await hasAuthToken();

  if (!authToken) {
    notFound();
  }

  return <EditorForm params={params} />;
}
