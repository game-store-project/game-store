'use client';

import { IGame } from '@/dtos/game';
import { IGenre } from '@/dtos/genre';
import { api } from '@/lib/api';
import { editorSchema, IEditor } from '@/validation/editor';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Control, ControlSelect, ControlTextarea, Input } from './ui/input';
import { Loading } from './ui/loading';
import { GameParams } from '@/app/dashboard/games/editor/[id]/page';

export const EditorForm = ({ params }: GameParams) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IEditor>({
    resolver: zodResolver(editorSchema),
    defaultValues: { disponibility: true },
  });

  const [genres, setGenres] = useState<IGenre[]>();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchGenres = useCallback(async () => {
    try {
      const response = await api.get<{ genres: IGenre[] }>('/genres');

      setGenres(response.data.genres);
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage: string | [] = error.response?.data.error;

        if (errorMessage === 'Internal server error') {
          toast.error('Ocorreu um interno no serviço da aplicação.');
        }
      }
    }
  }, []);

  const fetchGame = useCallback(async () => {
    if (!params?.id) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get<{ game: IGame }>(`/games/${params.id}/full`);

      const game = response.data.game;

      // Create the URL for the image
      const imageUrl = `${process.env.NEXT_PUBLIC_URL_API}/${game.imageUrl}`;

      // Fetch the image from the URL as a Blob
      const imageResponse = await fetch(imageUrl);
      const blob = await imageResponse.blob();

      // Create a File from the Blob
      const file = new File([blob], game.imageUrl, { type: blob.type });
      const fileList = new DataTransfer();
      fileList.items.add(file);

      setValue('image', fileList.files);
      setValue('title', game.title);
      setValue('year', game.year);
      setValue('price', game.price);
      setValue('description', game.description);
      setValue('genre', game.genreId);
      setValue('disponibility', game.disponibility);
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage: string | [] = error.response?.data.error;

        if (errorMessage === 'Content not found') {
          toast.error('Conteúdo não encontrado.');
          router.push('/dashboard/games');
        }

        if (errorMessage === 'Internal server error') {
          toast.error('Ocorreu um interno no serviço da aplicação.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [params?.id, router, setValue]);

  useEffect(() => {
    fetchGame();
  }, [fetchGame, params?.id]);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  const handleEditorSubmit = async (data: IEditor) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      const file = data.image[0] as File;

      formData.append('image', file);
      formData.append('title', data.title);
      formData.append('year', String(data.year));
      formData.append('price', String(data.price));
      formData.append('description', data.description);
      formData.append('genre', data.genre);
      formData.append('disponibility', String(data.disponibility));

      if (params?.id) {
        await api.put(`/games/${params.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        toast.success('Jogo atualizado com sucesso!');
      } else {
        await api.post('/games', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        toast.success('Jogo criado com sucesso!');
      }

      router.push('/dashboard/games');
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage: string | [] = error.response?.data.error;

        if (errorMessage === 'Title already registered') {
          toast.error('Título já cadastrado');
        }

        if (errorMessage === 'File cannot be empty') {
          toast.error('O arquivo não pode ser vazio');
        }

        if (errorMessage === 'Invalid file format') {
          toast.error('Formato de arquivo inválido');
        }

        if (errorMessage === 'Content not found') {
          toast.error('Conteúdo não encontrado');
          router.push('/dashboard/games');
        }

        if (errorMessage === 'Internal server error') {
          toast.error('Ocorreu um interno no serviço da aplicação');
        }
      } else {
        toast.error('Ocorreu um erro inesperado');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loading />
      </div>
    );
  }

  const image = watch('image')?.item(0);

  return (
    <div className="pb-5">
      <form
        className="relative mx-auto mt-12 flex max-w-[700px] flex-col justify-center gap-12 px-6"
        onSubmit={handleSubmit(handleEditorSubmit)}
      >
        <h1 className="text-2xl text-white">{params?.id ? 'EDITAR' : 'NOVO'} JOGO</h1>
        <div className="flex flex-col space-y-5">
          <Input
            error={errors.image?.message}
            name="image"
            data-error={errors.image?.message ? true : false}
            data-disabled={isLoading}
            className="data-[error=true]:ring-destructive data-[error=true]:focus-within:ring-destructive data-[disabled=true]:hover:bg-border/10 min-h-56 cursor-pointer"
          >
            {!image ? (
              <div className="w-full">
                <p
                  className="data-[error=true]:text-destructive text-border text-center"
                  data-error={errors.image?.message ? true : false}
                >
                  Selecione um arquivo
                </p>
              </div>
            ) : (
              <Image
                src={URL.createObjectURL(image)}
                alt="Imagem do jogo"
                width={200}
                height={200}
                className="size-full rounded-xl object-cover"
              />
            )}
            <Control
              {...register('image')}
              type="file"
              id="image"
              // onChange={handleFileSelected}
              accept=".jpg,.jpeg,.png,.webm"
              disabled={isLoading}
              className="group-data-[error=true]:text-destructive group-data-[error=true]:placeholder:text-destructive sr-only"
              autoComplete="off"
            />
          </Input>

          <Input
            error={errors.title?.message}
            name="title"
            data-error={errors.title?.message ? true : false}
            data-disabled={isLoading}
            className="data-[error=true]:ring-destructive data-[error=true]:focus-within:ring-destructive data-[disabled=true]:hover:bg-border/10"
          >
            <Control
              {...register('title')}
              placeholder="Inserir título do jogo"
              type="text"
              id="title"
              disabled={isLoading}
              className="group-data-[error=true]:text-destructive group-data-[error=true]:placeholder:text-destructive"
              autoComplete="off"
            />
          </Input>

          <Input
            error={errors.year?.message}
            name="year"
            data-error={errors.year?.message ? true : false}
            data-disabled={isLoading}
            className="data-[error=true]:ring-destructive data-[error=true]:focus-within:ring-destructive data-[disabled=true]:hover:bg-border/10"
          >
            <Control
              {...register('year')}
              placeholder="Inserir ano de lançamento"
              type="number"
              id="year"
              disabled={isLoading}
              className="group-data-[error=true]:text-destructive group-data-[error=true]:placeholder:text-destructive"
              autoComplete="off"
            />
          </Input>

          <Input
            error={errors.price?.message}
            name="price"
            data-error={errors.price?.message ? true : false}
            data-disabled={isLoading}
            className="data-[error=true]:ring-destructive data-[error=true]:focus-within:ring-destructive data-[disabled=true]:hover:bg-border/10"
          >
            <Control
              {...register('price')}
              placeholder="Inserir preço de venda"
              type="number"
              id="price"
              disabled={isLoading}
              className="group-data-[error=true]:text-destructive group-data-[error=true]:placeholder:text-destructive"
              autoComplete="off"
            />
          </Input>

          <Input
            error={errors.description?.message}
            name="description"
            data-error={errors.description?.message ? true : false}
            data-disabled={isLoading}
            className="data-[error=true]:ring-destructive data-[error=true]:focus-within:ring-destructive data-[disabled=true]:hover:bg-border/10"
          >
            <ControlTextarea
              {...register('description')}
              placeholder="Inserir descrição do jogo"
              id="description"
              disabled={isLoading}
              className="group-data-[error=true]:text-destructive group-data-[error=true]:placeholder:text-destructive min-h-36"
              autoComplete="off"
            />
          </Input>

          <Input
            error={errors.genre?.message}
            name="genre"
            data-error={errors.genre?.message ? true : false}
            data-disabled={isLoading}
            className="data-[error=true]:ring-destructive data-[error=true]:focus-within:ring-destructive data-[disabled=true]:hover:bg-border/10"
          >
            <ControlSelect
              {...register('genre')}
              id="genre"
              disabled={isLoading}
              className="group-data-[error=true]:text-destructive group-data-[error=true]:placeholder:text-destructive"
              autoComplete="off"
              defaultValue=""
            >
              <option defaultChecked value="" disabled>
                Selecione o gênero do jogo
              </option>
              {genres?.map((genre) => (
                <option className="text-foreground" key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </ControlSelect>
          </Input>

          <div className="flex items-center">
            <Control
              {...register('disponibility')}
              type="checkbox"
              id="disponibility"
              className="accent-primary mr-2 size-4"
              defaultChecked
            />
            <label htmlFor="disponibility">Habilitar disponibilidade</label>
          </div>

          <div className="flex w-full gap-5">
            <Button
              variant="default"
              type="button"
              className="flex-1"
              onClick={() => router.back()}
            >
              Voltar
            </Button>

            <Button
              className="flex-1"
              disabled={Object.keys(errors).length > 0 || isLoading}
              type="submit"
            >
              {isLoading ? (
                <Loading variant="small" size="button" />
              ) : (
                <span>Salvar</span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
