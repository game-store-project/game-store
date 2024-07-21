import Image from 'next/image';
import Link from 'next/link';

export const LoginForm = () => {
  return (
    <form
      className="bg-background mx-auto flex w-full max-w-lg flex-col gap-9 rounded-2xl p-8 shadow-xl"
      method="POST"
    >
      <div className="flex flex-col items-center gap-2">
        <Image src="/logo.svg" alt="logo.svg" width={200} height={200} />
        <span className="font-alt text-primary text-4xl font-medium">
          GAME<span className="text-foreground">STORE</span>
        </span>
      </div>

      <div className="flex flex-col space-y-5">
        <div>
          <h1 className="text-2xl font-medium leading-none">FAZER LOGIN</h1>
          <span>
            Não têm uma conta?{' '}
            <Link
              href="/register"
              className="text-primary hover:text-primary/90 focus-visible:ring-foreground rounded-lg p-0.5 font-bold outline-none hover:underline focus-visible:ring-1"
            >
              Criar conta!
            </Link>
          </span>
        </div>

        <input
          type="email"
          name="email"
          placeholder="Inserir seu e-mail"
          className="bg-input ring-border focus-visible:ring-primary rounded-xl px-3 py-3.5 outline-none ring-1 transition-all"
        />
        <input
          type="password"
          name="password"
          placeholder="Inserir sua senha"
          className="bg-input ring-border focus-visible:ring-primary rounded-xl px-3 py-3.5 outline-none ring-1 transition-all"
        />
        <button
          type="submit"
          className="bg-primary hover:bg-primary/90 active:bg-primary/80 disabled:bg-primary/70 text-md focus-visible:ring-foreground flex items-center justify-center rounded-xl py-3 font-medium text-purple-50 outline-none transition-all focus-visible:ring-1 active:transition-none"
        >
          Entrar
        </button>
      </div>
    </form>
  );
};
