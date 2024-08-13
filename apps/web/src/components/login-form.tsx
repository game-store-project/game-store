'use client';

import { setAuthToken, setCartToken } from '@/actions/headers';
import { IUser } from '@/dtos/user';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { ILogin, loginSchema } from '@/validation/login';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Control, Input } from './ui/input';
import { Loading } from './ui/loading';

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<ILogin>({
    resolver: zodResolver(loginSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const { setUser } = useAuth();

  const handleLogin = async (data: ILogin) => {
    setIsLoading(true);

    try {
      const response = await api.post<{ user: IUser; token: string; cartItems: string }>(
        '/users/signin',
        {
          ...data,
        },
      );

      const { user, token, cartItems } = response.data;

      await setAuthToken(token);

      setUser(user);

      if (cartItems) {
        await setCartToken(cartItems);
      }

      toast.info('Você entrou na sua conta!');

      redirect('/');
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage: string | [] = error.response?.data.error;

        if (errorMessage === 'Invalid credentials') {
          setError('email', { message: 'Credenciais inválidas' });
          setError('password', { message: 'Credenciais inválidas' });
        } else {
          alert(
            'Ocorreu um erro desconhecido, se o erro persistir tente novamente mais tarde.',
          );
        }
      }
    }

    setIsLoading(false);
  };

  return (
    <form
      className="bg-background mx-auto flex w-full max-w-lg flex-col gap-9 rounded-2xl p-8 shadow-xl"
      method="POST"
    >
      <div className="flex flex-col items-center gap-2">
        <Image src="/logo.svg" alt="logo.svg" width={200} height={200} quality={80} />
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

        <Input
          error={errors.email?.message}
          name="email"
          data-error={errors.email?.message ? true : false}
          data-disabled={isLoading}
          className="data-[error=true]:ring-destructive data-[error=true]:focus-within:ring-destructive data-[disabled=true]:hover:bg-border/10"
        >
          <Control
            {...register('email')}
            placeholder="Seu e-mail"
            type="email"
            id="email"
            disabled={isLoading}
            className="group-data-[error=true]:text-destructive group-data-[error=true]:placeholder:text-destructive"
            autoComplete="off"
          />
        </Input>

        <Input
          error={errors.password?.message}
          name="password"
          data-error={errors.password?.message ? true : false}
          data-disabled={isLoading}
          className="data-[error=true]:ring-destructive data-[error=true]:focus-within:ring-destructive data-[disabled=true]:hover:bg-border/10"
        >
          <Control
            {...register('password')}
            placeholder="Sua senha"
            type={isPasswordHidden ? 'password' : 'text'}
            id="password"
            disabled={isLoading}
            className="group-data-[error=true]:text-destructive group-data-[error=true]:placeholder:text-destructive rounded-r-none"
            autoComplete="off"
          />

          <Button
            onClick={() => setIsPasswordHidden(!isPasswordHidden)}
            data-error={errors.password?.message ? true : false}
            data-enabled={watch('password') ? true : false}
            className="data-[error=true]:data-[selected=true]:text-destructive data-[error=true]:text-destructive data-[selected=true]:text-primary group-focus-within:data-[error=false]:text-primary mx-1 disabled:hover:bg-transparent data-[enabled=true]:visible"
            variant="icon"
            size="icon"
            type="button"
            disabled={isLoading}
          >
            {isPasswordHidden ? <Eye /> : <EyeOff />}
          </Button>
        </Input>

        <Button
          disabled={Object.keys(errors).length > 0 || isLoading}
          type="submit"
          onClick={handleSubmit(handleLogin)}
        >
          {isLoading ? <Loading variant="small" size="button" /> : <span>Entrar</span>}
        </Button>
      </div>
    </form>
  );
};
