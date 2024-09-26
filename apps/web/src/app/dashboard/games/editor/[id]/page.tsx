import { hasAuthToken } from '@/actions/headers';
import { EditorForm } from '@/components/editor-form';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Editar Jogo | GameStore',
};

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
