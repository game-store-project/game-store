import { hasAuthToken } from '@/actions/headers';
import { RegisterForm } from '@/components/register-form';
import { AuthBanner } from '@/components/ui/auth-banner';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Criar conta | GameStore',
};

export default async function RegisterPage() {
  const authToken = await hasAuthToken();

  if (authToken) {
    redirect('/');
  }

  return (
    <main className="relative flex h-screen w-screen items-center">
      <AuthBanner />

      <div className="static z-10 flex w-full items-center justify-center md:absolute md:h-screen md:w-screen">
        <RegisterForm />
      </div>
    </main>
  );
}
