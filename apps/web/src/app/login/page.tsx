import { LoginForm } from '@/components/login-form';
import { AuthBanner } from '@/components/ui/auth-banner';

export default function LoginPage() {
  return (
    <main className="relative flex h-screen w-screen">
      <AuthBanner />

      <div className="absolute z-10 flex h-screen w-screen items-center justify-center">
        <LoginForm />
      </div>
    </main>
  );
}
