import { RegisterForm } from '@/components/register-form';
import { AuthBanner } from '@/components/ui/auth-banner';

export default function RegisterPage() {
  return (
    <main className="relative flex h-screen w-screen">
      <AuthBanner />

      <div className="absolute z-10 flex h-screen w-screen items-center justify-center">
        <RegisterForm />
      </div>
    </main>
  );
}
