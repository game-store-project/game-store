import { hasAuthToken } from '@/actions/headers';
import { EditorForm } from '@/components/editor-form';
import { notFound } from 'next/navigation';

export default async function EditorPage() {
  const authToken = await hasAuthToken();

  if (!authToken) {
    notFound();
  }

  return <EditorForm />;
}
