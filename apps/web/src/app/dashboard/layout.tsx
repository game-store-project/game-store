import { hasAuthToken } from '@/actions/headers';
import { Dashboard } from '@/components/dashboard';
import { Header } from '@/components/header';
import { Tabs } from '@/components/tabs';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Painel Administrativo | GameStore',
};

export default async function Layout({ children }: { children: ReactNode }) {
  const authToken = await hasAuthToken();

  if (!authToken) {
    notFound();
  }

  return (
    <Dashboard>
      <Header />

      <Tabs />

      {children}
    </Dashboard>
  );
}
