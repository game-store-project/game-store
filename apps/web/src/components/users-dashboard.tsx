'use client';

import { IUser } from '@/dtos/user';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { MoreHorizontal, UserPen } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
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

export const UsersDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<IUser[]>([]);

  const { isLoadingUserData } = useAuth();

  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get<{ users: IUser[] }>('/users');

      setUsers(response.data.users);
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
      fetchUsers();
    }
  }, [fetchUsers, isLoading, isLoadingUserData]);

  const handlePutUser = async (id: string) => {
    const action = confirm('Deseja realmente alterar o cargo deste usuário?');

    if (!action) return;

    setIsLoading(true);

    try {
      const response = await api.patch(`/users/${id}`, {});

      const { username, isAdmin } = response.data.user;

      toast.info(
        `Cargo do usuário ${username} alterado para ${isAdmin ? 'ADMIN' : 'USER'}.`,
      );

      await fetchUsers();
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage: string | [] = error.response?.data.error;

        if (errorMessage === 'Not allowed') {
          toast.error('Você não tem permissão para alterar seu próprio cargo.');
        }

        if (errorMessage === 'Content not found') {
          toast.error('Usuário não encontrado.');
        }

        if (errorMessage === 'Internal server error') {
          toast.error('Ocorreu um interno no serviço da aplicação.');
        }
      }
    }
  };

  return (
    <main className="mx-auto flex size-full max-w-[1400px] flex-1 flex-col space-y-5 px-6 py-8">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">USUÁRIOS</h1>

        <hr className="bg-border h-5 w-0.5" />
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
                <TableHead>Usuário</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users?.map((user) => {
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.username}</span>
                        <span className="text-xs text-gray-500">{user.id}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className="rounded-full bg-blue-950/70 px-2 py-1 text-blue-400 data-[admin=true]:bg-emerald-950/70 data-[admin=true]:text-emerald-400"
                        data-admin={user.isAdmin}
                      >
                        {user.isAdmin ? 'ADMIN' : 'USER'}
                      </span>
                    </TableCell>
                    <TableCell>{dayjs(user.createdAt).format('DD/MM/YYYY')}</TableCell>
                    <TableCell>
                      <PopoverMenu>
                        <PopoverMenuTrigger>
                          <MoreHorizontal className="size-4" />
                        </PopoverMenuTrigger>

                        <PopoverMenuContent>
                          <PopoverMenuItem
                            onClick={() => handlePutUser(user.id)}
                            className="text-yellow-400"
                          >
                            <UserPen className="size-4" />
                            Alterar cargo
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
