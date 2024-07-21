import type { Metadata } from 'next';
import { Inder, Inter } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const inder = Inder({ weight: '400', subsets: ['latin'], variable: '--font-inder' });

export const metadata: Metadata = {
  title: 'GameStore',
  description: 'The GameStore is the best place to buy games!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} ${inder.variable}`}>{children}</body>
    </html>
  );
}
