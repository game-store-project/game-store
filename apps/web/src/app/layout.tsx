import { AuthProvider } from '@/contexts/auth';
import { CartProvider } from '@/contexts/cart';
import type { Metadata } from 'next';
import { Inder, Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const inder = Inder({ weight: '400', subsets: ['latin'], variable: '--font-inder' });

export const metadata: Metadata = {
  title: 'GameStore',
  description: 'A GameStore é o melhor lugar para você comprar seus jogos!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} ${inder.variable}`}>
        <AuthProvider>
          <CartProvider>
            <Toaster
              richColors
              expand
              closeButton
              theme={'dark'}
              toastOptions={{
                style: {
                  willChange: 'unset',
                },
              }}
            />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
