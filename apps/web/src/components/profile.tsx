'use client';

import { ProfileParams } from '@/app/me/[profile]/page';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { ACCEPTED_IMAGE_TYPES } from '@/validation/editor';
import {
  emailSchema,
  IEmail,
  IPassword,
  IUsername,
  passwordSchema,
  usernameSchema,
} from '@/validation/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { AtSign, Eye, EyeOff, Lock, PenSquare, UserPen } from 'lucide-react';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { GameSection } from './game-section';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Control, Input } from './ui/input';
import { Loading } from './ui/loading';

export const Profile = ({ params }: ProfileParams) => {
  const [open, setOpen] = useState(false);

  const { user, removeUserAndToken, setUser } = useAuth();

  const [dialogType, setDialogType] = useState<'username' | 'email' | 'password' | null>(
    null,
  );

  // const pathname = usePathname();
  // const params = useParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<IUsername | IEmail | IPassword>({
    resolver: zodResolver(
      dialogType === 'username'
        ? usernameSchema
        : dialogType === 'email'
          ? emailSchema
          : passwordSchema,
    ),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState({
    password: true,
    new_password: true,
    confirm_password: true,
  });

  if (!user?.id || user.username !== params.profile) {
    return notFound();
  }

  const handleChangeUserAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error('A imagem deve ser do tipo JPEG, JPG, PNG ou WEBP');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.patch('/users/account/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedUser = response.data;

      setUser({
        ...user,
        ...updatedUser,
      });

      toast.success('Avatar atualizado com sucesso.');
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage: string | [] = error.response?.data.error;

        if (errorMessage === 'File cannot be empty') {
          toast.error('O arquivo não pode ser vazio.');
        }

        if (errorMessage === 'Invalid file format') {
          toast.error('Formato de arquivo inválido.');
        }

        if (errorMessage === 'Resource not found') {
          toast.error('Recurso não encontrado.');
          await removeUserAndToken();
        }

        if (errorMessage === 'Internal server error') {
          toast.error('Ocorreu um interno no serviço da aplicação.');
        }
      }
    }
  };

  const handleChangeUserProps = async (data: IUsername | IEmail | IPassword) => {
    setIsLoading(true);

    try {
      const response = await api.put('/users/account', { ...data });

      const updatedUser = response.data;

      setUser({
        ...user,
        ...updatedUser,
      });

      if ('username' in updatedUser) {
        params.profile = updatedUser.username;
        router.push(`/me/${updatedUser.username}`);
      }

      toast.success('Dados atualizados com sucesso.');

      handleClose();
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage: string | [] = error.response?.data.error;

        console.log(errorMessage);

        if (errorMessage === 'Username in use') {
          setError('username', { message: 'Nome de usuário em uso' });
        }

        if (errorMessage === 'Email in use') {
          setError('email', { message: 'E-mail em uso' });
        }

        if (errorMessage === 'Password is required') {
          setError('password', { message: 'Senha é obrigatória' });
        }

        if (errorMessage === 'Password is wrong') {
          setError('password', { message: 'Senha incorreta' });
        }

        if (errorMessage === 'Resource not found') {
          toast.error('Recurso não encontrado.');
          await removeUserAndToken();
        }

        if (errorMessage === 'Internal server error') {
          toast.error('Ocorreu um interno no serviço da aplicação.');
          handleClose();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);

    setTimeout(() => {
      setDialogType(null);
      clearErrors();

      reset({
        confirm_password: '',
        email: '',
        new_password: '',
        password: '',
        username: '',
      });

      setIsPasswordHidden({
        password: true,
        new_password: true,
        confirm_password: true,
      });
    }, 250);
  };

  return (
    <section className="mx-auto mt-8 w-full max-w-[1260px] space-y-4">
      <div className="mx-6 space-y-2">
        <h1 className="text-xl">MEU PERFIL</h1>
        <div className="bg-secondary flex w-full items-center justify-between gap-3 rounded-lg p-6">
          <div className="flex space-x-3">
            <div className="relative">
              <Image
                src={
                  user?.avatar
                    ? `${process.env.NEXT_PUBLIC_URL_API}/${user.avatar}`
                    : '/no_profile.jpg'
                }
                alt="No profile"
                width={100}
                height={100}
                className="aspect-square size-auto max-h-[120px] max-w-[120px] overflow-hidden rounded-full object-cover"
                priority
              />

              <input
                type="file"
                id="image"
                name="image"
                onChange={handleChangeUserAvatar}
                className="hidden"
              />

              <label
                htmlFor="image"
                title="Alterar avatar"
                className="bg-input hover:bg-input/95 absolute bottom-0 right-0 cursor-pointer rounded-full p-2"
              >
                <PenSquare className="size-6" />
              </label>
            </div>

            <div className="flex max-w-44 flex-col justify-center sm:max-w-full">
              <span className="truncate font-bold sm:text-lg">{user.username}</span>
              <span className="truncate text-xs text-gray-400 sm:text-sm">
                {user.email}
              </span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger title="Editar dados">
              <div className="bg-input hover:bg-input/90 flex h-full items-center justify-center rounded-full">
                <PenSquare className="size-6" />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="data-[state=closed]:animate-[content-hide_200ms] data-[state=open]:animate-[menu-show_200ms]">
              <DropdownMenuItem
                onClick={() => {
                  setDialogType('username');
                  setOpen(true);
                }}
              >
                <UserPen className="size-5" />
                Editar username
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setDialogType('email');
                  setOpen(true);
                }}
              >
                <AtSign className="size-5" />
                Editar e-mail
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setDialogType('password');
                  setOpen(true);
                }}
              >
                <Lock className="size-5" />
                Editar senha
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {user.games.length > 0 && <GameSection games={user.games} title="MEUS JOGOS" />}

      <Dialog open={open}>
        <DialogOverlay className="data-[state=closed]:animate-[overlay-hide_300ms] data-[state=open]:animate-[overlay-show_200ms]">
          <DialogContent className="outline-none data-[state=closed]:animate-[content-hide_200ms] data-[state=open]:animate-[content-show_200ms]">
            <form className="space-y-5" method="POST">
              {dialogType === 'username' && (
                <div className="space-y-5">
                  <DialogTitle>ATUALIZAR USERNAME</DialogTitle>
                  <Input
                    error={
                      errors && 'username' in errors
                        ? errors.username?.message
                        : undefined
                    }
                    name="username"
                    data-error={errors && 'username' in errors ? true : false}
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
                </div>
              )}

              {dialogType === 'email' && (
                <div className="space-y-5">
                  <DialogTitle>ATUALIZAR EMAIL</DialogTitle>
                  <Input
                    error={
                      errors && 'email' in errors ? errors.email?.message : undefined
                    }
                    name="email"
                    data-error={errors && 'email' in errors ? true : false}
                    data-disabled={isLoading}
                    className="data-[error=true]:ring-destructive data-[error=true]:focus-within:ring-destructive data-[disabled=true]:hover:bg-border/10"
                  >
                    <Control
                      {...register('email')}
                      placeholder="Insira um e-mail*"
                      type="email"
                      id="email"
                      disabled={isLoading}
                      className="group-data-[error=true]:text-destructive group-data-[error=true]:placeholder:text-destructive"
                      autoComplete="off"
                    />
                  </Input>

                  <Input
                    error={
                      errors && 'password' in errors
                        ? errors.password?.message
                        : undefined
                    }
                    name="password"
                    data-error={errors && 'password' in errors ? true : false}
                    data-disabled={isLoading}
                    className="data-[error=true]:ring-destructive data-[error=true]:focus-within:ring-destructive data-[disabled=true]:hover:bg-border/10"
                  >
                    <Control
                      {...register('password')}
                      placeholder="Inserir a senha atual*"
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
                      data-error={errors && 'password' in errors ? true : false}
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
                </div>
              )}

              {dialogType === 'password' && (
                <div className="space-y-5">
                  <DialogTitle>ATUALIZAR SENHA</DialogTitle>
                  <Input
                    error={
                      errors && 'password' in errors
                        ? errors.password?.message
                        : undefined
                    }
                    name="password"
                    data-error={errors && 'password' in errors ? true : false}
                    data-disabled={isLoading}
                    className="data-[error=true]:ring-destructive data-[error=true]:focus-within:ring-destructive data-[disabled=true]:hover:bg-border/10"
                  >
                    <Control
                      {...register('password')}
                      placeholder="Inserir a senha atual*"
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
                      data-error={errors && 'password' in errors ? true : false}
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
                    error={
                      errors && 'new_password' in errors
                        ? errors.new_password?.message
                        : undefined
                    }
                    name="new_password"
                    data-error={errors && 'new_password' in errors ? true : false}
                    data-disabled={isLoading}
                    className="data-[error=true]:ring-destructive data-[error=true]:focus-within:ring-destructive data-[disabled=true]:hover:bg-border/10"
                  >
                    <Control
                      {...register('new_password')}
                      placeholder="Crie uma nova senha*"
                      type={isPasswordHidden.new_password ? 'password' : 'text'}
                      id="new_password"
                      disabled={isLoading}
                      className="group-data-[error=true]:text-destructive group-data-[error=true]:placeholder:text-destructive rounded-r-none"
                      autoComplete="off"
                    />

                    <Button
                      onClick={() =>
                        setIsPasswordHidden({
                          ...isPasswordHidden,
                          new_password: !isPasswordHidden.new_password,
                        })
                      }
                      data-error={errors && 'new_password' in errors ? true : false}
                      data-enabled={watch('new_password') ? true : false}
                      className="data-[error=true]:data-[selected=true]:text-destructive data-[error=true]:text-destructive data-[selected=true]:text-primary group-focus-within:data-[error=false]:text-primary mx-1 disabled:hover:bg-transparent data-[enabled=true]:visible"
                      variant="icon"
                      size="icon"
                      type="button"
                      disabled={isLoading}
                    >
                      {isPasswordHidden.new_password ? <Eye /> : <EyeOff />}
                    </Button>
                  </Input>

                  <Input
                    label="Confirmar senha"
                    error={
                      errors && 'confirm_password' in errors
                        ? errors.confirm_password?.message
                        : undefined
                    }
                    name="confirm_password"
                    data-error={errors && 'confirm_password' in errors ? true : false}
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
                      data-error={errors && 'confirm_password' in errors ? true : false}
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
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  className="w-full"
                  variant="default"
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>

                <Button
                  className="w-full"
                  type="submit"
                  disabled={Object.keys(errors).length > 0 || isLoading}
                  onClick={handleSubmit(handleChangeUserProps)}
                >
                  {isLoading ? (
                    <Loading variant="small" size="button" />
                  ) : (
                    <span>Salvar</span>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </DialogOverlay>
      </Dialog>
    </section>
  );
};
