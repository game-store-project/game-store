'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/ui/button';
import { Input, Control } from '../../components/ui/input';
import { Loading } from '../../components/ui/loading';

const schema = z.object({
  image: z.instanceof(File).optional(),
  title: z.string().min(1, 'O título é obrigatório'),
  year: z
    .number()
    .min(1900, 'O ano deve ser maior que 1900')
    .max(new Date().getFullYear(), 'O ano não pode ser maior que o ano atual'),
  price: z.number().min(0, 'O preço deve ser maior ou igual a zero'),
  description: z.string().optional(),
  genre: z.string().min(1, 'O gênero é obrigatório'),
  disponibility: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function NewGamePage() {
  // const authToken = await hasAuthToken();

  // if (authToken) {
  //   redirect('/');
  // }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data: FormValues) => {
    setIsLoading(true);
    try {
      console.log(data);
    } catch (error) {
      console.error('Erro ao enviar os dados', error);
    }
    setIsLoading(false);
  };

  return (
    <form
      className="gap-12flex relative mt-12 flex w-full flex-col justify-center"
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

        {/*TODO CAMPO SELECT*/}

        {/*TODO CAMPO DISPONIBILIDADE */}

        <Button disabled={Object.keys(errors).length > 0 || isLoading} type="submit">
          {isLoading ? <Loading variant="small" size="button" /> : <span>Enviar</span>}
        </Button>
      </div>
    </form>
  );
}
