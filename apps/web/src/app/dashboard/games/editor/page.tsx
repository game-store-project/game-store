import { hasAuthToken } from '@/actions/headers';
import { EditorForm } from '@/components/editor-form';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Criar Jogo | GameStore',
};

export default async function CreateGamePage() {
  const authToken = await hasAuthToken();

  if (!authToken) {
    notFound();
  }

  return <EditorForm />;
}
