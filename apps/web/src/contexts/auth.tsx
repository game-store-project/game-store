'use client';

import { deleteAuthToken, hasAuthToken, setCartToken } from '@/actions/headers';
import { api } from '@/lib/api';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { ReactNode, createContext, useCallback, useEffect, useState } from 'react';
import { IUser } from '../dtos/user';

export interface AuthContextProps {
  user: IUser | undefined;
  setUser: (user: IUser) => void;
  isLoadingUserData: boolean;
  removeUserAndToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser>({} as IUser);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

  const router = useRouter();

  const removeUserAndToken = useCallback(async () => {
    setIsLoadingUserData(true);

    await deleteAuthToken();
    setUser({} as IUser);

    router.push('/');

    setIsLoadingUserData(false);
  }, [router]);

  const loadUserData = useCallback(async () => {
    const authToken = await hasAuthToken();

    if (authToken) {
      try {
        const response = await api.get<{ user: IUser; cartItems: string }>(
          '/users/account',
        );

        const { user, cartItems } = response.data;

        setUser(user);

        if (cartItems) {
          await setCartToken(cartItems);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          const errorMessage: string | [] = error.response?.data.error;

          if (errorMessage === 'Resource not found') {
            await removeUserAndToken();
          }
        }
      }
    }

    setIsLoadingUserData(false);
  }, [removeUserAndToken]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoadingUserData,
        removeUserAndToken,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
