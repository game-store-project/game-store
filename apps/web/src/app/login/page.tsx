import { hasAuthToken } from '@/actions/headers';
import { LoginForm } from '@/components/login-form';
import { AuthBanner } from '@/components/ui/auth-banner';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Entrar | GameStore',
};

export default async function LoginPage() {
  const authToken = await hasAuthToken();

  if (authToken) {
    redirect('/');
  }

  return (
    <main className="relative flex h-screen w-screen items-center">
      <AuthBanner />

      <div className="absolute z-10 flex h-screen w-screen items-center justify-center">
        <LoginForm />
      </div>
    </main>
  );
}
