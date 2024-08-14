'use client';

import { useAuth } from '@/hooks/use-auth';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loading } from './ui/loading';

export const Dashboard = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);

  const { user, isLoadingUserData } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleCheck = () => {
      if (user?.isAdmin) {
        if (pathname === '/dashboard') {
          router.push('/dashboard/games');
        }
        setIsLoading(false);
      } else {
        toast.error('Acesso negado.');
        router.push('/');
      }
    };

    if (!isLoadingUserData && pathname) {
      handleCheck();
    }
  }, [isLoadingUserData, pathname, router, user?.isAdmin]);

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Loading />
      </div>
    );
  }

  return <div className="flex h-screen flex-col">{children}</div>;
};
