'use client';

import { IGame } from '@/dtos/game';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { formatPrice } from '@/utils/price';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { ExternalLink, MoreHorizontal, Plus, SquarePen, Trash } from 'lucide-react';
import NextLink from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Link } from './ui/link';
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

export const GamesDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<IGame[]>([]);

  const { isLoadingUserData } = useAuth();

  const fetchGames = useCallback(async () => {
    try {
      const response = await api.get<{ games: IGame[] }>('/games');

      setGames(response.data.games);
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
      fetchGames();
    }
  }, [fetchGames, isLoading, isLoadingUserData]);

  const handleDeleteGame = async (id: string) => {
    const action = confirm('Deseja realmente excluir este jogo?');

    if (!action) return;

    setIsLoading(true);

    try {
      await api.delete(`/games/${id}`);

      toast.info('Jogo excluído com sucesso.');

      await fetchGames();
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage: string | [] = error.response?.data.error;

        if (errorMessage === 'Game bought by an user') {
          toast.error('Este jogo foi comprado por um usuário.');
        }

        if (errorMessage === 'Content not found') {
          toast.error('Jogo não encontrado.');
        }

        if (errorMessage === 'Internal server error') {
          toast.error('Ocorreu um interno no serviço da aplicação.');
        }
      }
    }
    setIsLoading(false);
  };

  return (
    <main className="mx-auto flex size-full max-w-[1260px] flex-1 flex-col space-y-5 px-6 py-8">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">JOGOS</h1>

        <hr className="bg-border h-5 w-0.5" />

        <Link href="/dashboard/games/editor" variant="primary" className="pr-4">
          <Plus className="size-4" />
          Novo jogo
        </Link>
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
                <TableHead>Jogo</TableHead>
                <TableHead>Lançamento</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Disponibilidade</TableHead>
                <TableHead>Gênero</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {games?.map((game) => {
                return (
                  <TableRow key={game.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{game.title}</span>
                        <span className="text-xs text-gray-500">{game.id}</span>
                      </div>
                    </TableCell>
                    <TableCell>{game.year}</TableCell>
                    <TableCell>{formatPrice(game.price)}</TableCell>
                    <TableCell>
                      <span
                        className="rounded-full bg-yellow-950/70 px-2 py-1 text-yellow-400 data-[public=true]:bg-emerald-950/70 data-[public=true]:text-emerald-400"
                        data-public={game.disponibility}
                      >
                        {game.disponibility ? 'DISPONÍVEL' : 'INDISPONÍVEL'}
                      </span>
                    </TableCell>
                    <TableCell>{game.genre?.name}</TableCell>
                    <TableCell>{dayjs(game.createdAt).format('DD/MM/YYYY')}</TableCell>
                    <TableCell>
                      <PopoverMenu>
                        <PopoverMenuTrigger>
                          <MoreHorizontal className="size-4" />
                        </PopoverMenuTrigger>

                        <PopoverMenuContent>
                          <PopoverMenuItem asChild>
                            <NextLink href={`/${game.slug}`}>
                              <ExternalLink className="size-4" />
                              Visualizar
                            </NextLink>
                          </PopoverMenuItem>

                          <PopoverMenuItem asChild>
                            <NextLink href={`/dashboard/games/editor/${game.id}`}>
                              <SquarePen className="size-4" />
                              Editar
                            </NextLink>
                          </PopoverMenuItem>

                          <PopoverMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteGame(game.id)}
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
