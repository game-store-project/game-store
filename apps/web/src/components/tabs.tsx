'use client';

import { ArrowUpNarrowWide, Gamepad2, User2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Link } from './ui/link';

export function Tabs() {
  const pathname = usePathname();

  return (
    <div>
      <nav className="mx-auto flex max-w-[1400px] items-center justify-center gap-2 overflow-x-auto px-6 py-4 sm:justify-normal">
        <Link
          title="Jogos"
          href="/dashboard/games"
          className="data-[selected=true]:bg-secondary"
          data-selected={pathname === '/dashboard/games'}
        >
          <Gamepad2 className="size-5" />
          <span className="sr-only sm:not-sr-only">Jogos</span>
        </Link>

        <Link
          title="Gêneros"
          href="/dashboard/genres"
          className="data-[selected=true]:bg-secondary"
          data-selected={pathname === '/dashboard/genres'}
        >
          <ArrowUpNarrowWide className="size-5" />
          <span className="sr-only sm:not-sr-only">Gêneros</span>
        </Link>

        <Link
          title="Usuários"
          href="/dashboard/users"
          className="data-[selected=true]:bg-secondary"
          data-selected={pathname === '/dashboard/users'}
        >
          <User2 className="size-5" />
          <span className="sr-only sm:not-sr-only">Usuários</span>
        </Link>
      </nav>
    </div>
  );
}
