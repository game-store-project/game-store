'use client';

import { IGenre } from '@/dtos/genre';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { MoreHorizontal, Plus, SquarePen, Trash } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Loading } from './ui/loading';
import {
  PopoverMenu,
  PopoverMenuContent,
  PopoverMenuItem,
  PopoverMenuTrigger,
} from './ui/popover-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

export const GenresDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [genres, setGenres] = useState<IGenre[]>([]);

  const { isLoadingUserData } = useAuth();

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

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoadingUserData && isLoading) {
      fetchGenres();
    }
  }, [fetchGenres, isLoading, isLoadingUserData]);

  const handleCreateGenre = async () => {
    const value = prompt('Crie um novo gênero');

    if (!value) return;

    setIsLoading(true);

    try {
      await api.post('/genres', { name: value });

      await fetchGenres();
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage: string | [] = error.response?.data.error;

        if (errorMessage === 'Genre already registered') {
          toast.error('O gênero já foi cadastrado.');
        }

        if (errorMessage === 'Internal server error') {
          toast.error('Ocorreu um interno no serviço da aplicação.');
        }
      }
    }
  };

  const handlePutGenre = async (id: string, name: string) => {
    const value = prompt('Atualize o gênero atual', name);

    if (!value) return;

    setIsLoading(true);

    try {
      await api.put(`/genres/${id}`, { name: value });

      toast.info('Gênero atualizado com sucesso.');

      await fetchGenres();
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage: string | [] = error.response?.data.error;

        if (errorMessage === 'Genre already registered') {
          toast.error('O gênero já foi cadastrado.');
        }

        if (errorMessage === 'Content not found') {
          toast.error('Gênero não encontrado.');
        }

        if (errorMessage === 'Internal server error') {
          toast.error('Ocorreu um interno no serviço da aplicação.');
        }
      }
    }
  };

  const handleDeleteGenre = async (id: string) => {
    const action = confirm('Deseja realmente excluir este gênero?');

    if (!action) return;

    setIsLoading(true);

    try {
      await api.delete(`/genres/${id}`);

      toast.info('Gênero excluído com sucesso.');

      await fetchGenres();
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage: string | [] = error.response?.data.error;

        if (errorMessage === 'Genre registered in a game') {
          toast.error('O gênero está registrado em um jogo.');
        }

        if (errorMessage === 'Content not found') {
          toast.error('Gênero não encontrado.');
        }

        if (errorMessage === 'Internal server error') {
          toast.error('Ocorreu um interno no serviço da aplicação.');
        }
      }
    }
    setIsLoading(false);
  };

  return (
    <main className="mx-auto flex size-full max-w-[1400px] flex-1 flex-col space-y-5 px-6 py-8">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">GÊNEROS</h1>

        <hr className="bg-border h-5 w-0.5" />

        <Button
          className="gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium"
          onClick={handleCreateGenre}
        >
          <Plus className="size-4" />
          Novo gênero
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-full">
          <Loading />
        </div>
      ) : (
        <div className="max-h-[650px] overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Quantidade de jogos</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {genres?.map((genre) => {
                return (
                  <TableRow key={genre.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{genre.name}</span>
                        <span className="text-xs text-gray-500">{genre.id}</span>
                      </div>
                    </TableCell>
                    <TableCell>{genre._count.Game} jogo(s)</TableCell>
                    <TableCell>{dayjs(genre.createdAt).format('DD/MM/YYYY')}</TableCell>
                    <TableCell>
                      <PopoverMenu>
                        <PopoverMenuTrigger>
                          <MoreHorizontal className="size-4" />
                        </PopoverMenuTrigger>

                        <PopoverMenuContent>
                          <PopoverMenuItem
                            onClick={() => handlePutGenre(genre.id, genre.name)}
                          >
                            <SquarePen className="size-4" />
                            Editar
                          </PopoverMenuItem>

                          <PopoverMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteGenre(genre.id)}
                          >
                            <Trash className="size-4" />
                            Excluir
                          </PopoverMenuItem>
                        </PopoverMenuContent>
                      </PopoverMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </main>
  );
};
