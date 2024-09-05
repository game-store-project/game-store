'use client';

import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../components/ui/button';
import { Input, Control, ControlSelect } from '../../../components/ui/input';
import { Loading } from '../../../components/ui/loading';
import { api } from '@/lib/api';
import { Main } from '@/components/main';
import { Header } from '@/components/header';
import { notFound, useRouter } from 'next/navigation';
import { hasAuthToken } from '@/actions/headers';
import { IGenre } from '@/dtos/genre';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const schema = z.object({
  image: z
    .any()
    .optional()
    .refine(
      (file) =>
        file.length == 1
          ? ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type)
            ? true
            : false
          : true,
      'Invalid file. choose either JPEG or PNG image',
    ),
  title: z.string().min(1, 'O título é obrigatório'),
  year: z.coerce
    .number()
    .min(1900, 'O ano deve ser maior que 1900')
    .max(new Date().getFullYear(), 'O ano não pode ser maior que o ano atual'),
  price: z.coerce.number().min(0, 'O preço deve ser maior ou igual a zero'),
  description: z.string().optional(),
  genre: z.string().min(1, 'O gênero é obrigatório'),
  disponibility: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function NewGamePage({ params }: { params: { id: string } }) {
  const [initialData, setInitialData] = useState();
  const validateAuthToken = async () => {
    const authToken = await hasAuthToken();

    if (authToken) {
      notFound();
    }
  };

  const router = useRouter();

  const getGameData = async () => {
    try {
      const initialData = await api.get(`/games/${params.id}`);
      setInitialData(initialData);
    } catch (error) {
      console.error('Erro ao enviar os dados', error);
      router.push('/dashboard/games');
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [genres, setGenres] = useState<IGenre[]>();

  const onSubmit = (data: FormValues) => {
    setIsLoading(true);
    try {
      api.put(`/games/${params.id}`, data);
    } catch (error) {
      console.error('Erro ao enviar os dados', error);
    }
    setIsLoading(false);
  };

  const handleBack = () => {
    router.push('/dashboard/games');
  };

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

  useEffect(() => {
    validateAuthToken();
    getGameData();
    fetchGenres();
  }, [fetchGenres, getGameData]);

  return (
    <Main>
      <Header />
      <form
        className="relative mx-auto mt-12 flex max-w-[700px] flex-col justify-center gap-12 px-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-2xl text-white">NOVO JOGO</h1>
        <div className="flex flex-col space-y-5">
          <Input
            error={errors.image?.message}
            name="image"
            data-error={errors.image?.message ? true : false}
            data-disabled={isLoading}
            className="data-[error=true]:ring-destructive data-[error=true]:focus-within:ring-destructive data-[disabled=true]:hover:bg-border/10"
          >
            <Control
              {...register('image')}
              placeholder="Adicionar imagem de exibição"
              type="file"
              id="image"
              disabled={isLoading}
              className="group-data-[error=true]:text-destructive group-data-[error=true]:placeholder:text-destructive"
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
            <Control
              {...register('description')}
              placeholder="Inserir descrição do jogo"
              type="textarea"
              id="description"
              disabled={isLoading}
              className="group-data-[error=true]:text-destructive group-data-[error=true]:placeholder:text-destructive"
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
              placeholder="Inserir descrição do jogo"
              type="select"
              id="genre"
              disabled={isLoading}
              className="group-data-[error=true]:text-destructive group-data-[error=true]:placeholder:text-destructive"
              autoComplete="off"
            >
              {genres?.map((genre) => {
                return (
                  <option key={genre.id} value={genre.name}>
                    {genre.name}
                  </option>
                );
              })}
            </ControlSelect>
          </Input>

          <div>
            <Control
              {...register('disponibility')}
              type="checkbox"
              id="disponibility"
              disabled={isLoading}
              className="group-data-[error=true]:text-destructive group-data-[error=true]:placeholder:text-destructive mr-2 w-auto"
              autoComplete="off"
              defaultChecked
            />
            <label htmlFor="disponibility">Habilitar disponibilidade</label>
          </div>

          <div className="flex w-full gap-5">
            <Button variant="default" className="flex-1" onClick={handleBack}>
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
    </Main>
  );
}
