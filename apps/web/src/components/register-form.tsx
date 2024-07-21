'use client';

import { IRegister, registerSchema } from '@/validation/register';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Control, Input } from './ui/input';
import { Loading } from './ui/loading';

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IRegister>({
    resolver: zodResolver(registerSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState({
    password: true,
    confirm_password: true,
  });

  const handleRegister = async (data: IRegister) => {
    setIsLoading(true);

    setTimeout(() => {
      console.log(data);
      setIsLoading(false);
    }, 2000);
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
          <h1 className="text-2xl font-medium leading-none">CRIAR CONTA</h1>
          <span>
            Já têm uma conta?{' '}
            <Link
              href="/login"
              className="text-primary hover:text-primary/90 focus-visible:ring-foreground rounded-lg p-0.5 font-bold outline-none hover:underline focus-visible:ring-1"
            >
              Acessar conta!
            </Link>
          </span>
        </div>

        <Input
          error={errors.username?.message}
          name="username"
          data-error={errors.username?.message ? true : false}
          data-disabled={isLoading}
          className="data-[error=true]:ring-destructive data-[error=true]:focus-within:ring-destructive data-[disabled=true]:hover:bg-border/10"
        >
          <Control
            {...register('username')}
            placeholder="Insira um nome de usuário*"
            type="text"
            id="username"
            disabled={isLoading}
            className="group-data-[error=true]:text-destructive group-data-[error=true]:placeholder:text-destructive"
            autoComplete="off"
          />
        </Input>

        <Input
          error={errors.email?.message}
          name="email"
          data-error={errors.email?.message ? true : false}
          data-disabled={isLoading}
          className="data-[error=true]:ring-destructive data-[error=true]:focus-within:ring-destructive data-[disabled=true]:hover:bg-border/10"
        >
          <Control
            {...register('email')}
            placeholder="Insira seu e-mail*"
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
            placeholder="Crie uma senha*"
            type={isPasswordHidden.password ? 'password' : 'text'}
            id="password"
            disabled={isLoading}
            className="group-data-[error=true]:text-destructive group-data-[error=true]:placeholder:text-destructive rounded-r-none"
            autoComplete="off"
          />

          <Button
            onClick={() =>
              setIsPasswordHidden({
                ...isPasswordHidden,
                password: !isPasswordHidden.password,
              })
            }
            data-error={errors.password?.message ? true : false}
            data-enabled={watch('password') ? true : false}
            className="data-[error=true]:data-[selected=true]:text-destructive data-[error=true]:text-destructive data-[selected=true]:text-primary group-focus-within:data-[error=false]:text-primary mx-1 disabled:hover:bg-transparent data-[enabled=true]:visible"
            variant="icon"
            size="icon"
            type="button"
            disabled={isLoading}
          >
            {isPasswordHidden.password ? <Eye /> : <EyeOff />}
          </Button>
        </Input>

        <Input
          label="Confirmar senha"
          error={errors.confirm_password?.message}
          name="confirm_password"
          data-error={errors.confirm_password?.message ? true : false}
          data-disabled={isLoading}
          className="data-[error=true]:ring-destructive data-[error=true]:focus-within:ring-destructive data-[disabled=true]:hover:bg-border/10"
        >
          <Control
            {...register('confirm_password')}
            placeholder="Repita a senha*"
            type={isPasswordHidden.confirm_password ? 'password' : 'text'}
            id="confirm_password"
            disabled={isLoading}
            className="group-data-[error=true]:text-destructive group-data-[error=true]:placeholder:text-destructive rounded-r-none"
            autoComplete="off"
          />

          <Button
            onClick={() =>
              setIsPasswordHidden({
                ...isPasswordHidden,
                confirm_password: !isPasswordHidden.confirm_password,
              })
            }
            data-error={errors.confirm_password?.message ? true : false}
            data-enabled={watch('confirm_password') ? true : false}
            className="data-[error=true]:data-[selected=true]:text-destructive data-[error=true]:text-destructive data-[selected=true]:text-primary group-focus-within:data-[error=false]:text-primary mx-1 disabled:hover:bg-transparent data-[enabled=true]:visible"
            disabled={isLoading}
            variant="icon"
            size="icon"
            type="button"
          >
            {isPasswordHidden.confirm_password ? <Eye /> : <EyeOff />}
          </Button>
        </Input>

        <Button
          disabled={Object.keys(errors).length > 0 || isLoading}
          type="submit"
          onClick={handleSubmit(handleRegister)}
        >
          {isLoading ? (
            <Loading variant="small" size="button" />
          ) : (
            <span>Criar conta</span>
          )}
        </Button>
      </div>
    </form>
  );
};
