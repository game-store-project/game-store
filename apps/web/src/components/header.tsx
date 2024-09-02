'use client';

import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import {
  Cog,
  LogIn,
  LogOut,
  Search,
  SearchIcon,
  ShoppingCart,
  User2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Control, Input } from './ui/input';

export const Header = () => {
  const [searchBar, setSearchBar] = useState(false);

  const { user, removeUserAndToken } = useAuth();
  const { cartItems, setCartItems } = useCart();

  const controlRef = useRef<HTMLInputElement>(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const setParams = (query: string) => {
    const params = new URLSearchParams(searchParams);

    if (query) {
      params.set('search', query);
    } else params.delete('search');

    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setParams(query);
  }, 750);

  const handleSignOut = async () => {
    await removeUserAndToken();
    setCartItems([]);

    toast.info('Você saiu da sua conta!');
  };

  useEffect(() => {
    if (searchBar && controlRef.current) {
      controlRef.current.focus();
    }
  }, [searchBar]);

  return (
    <header className="border-border border-b">
      <div className="mx-auto flex w-full max-w-[1260px] items-center justify-between gap-4 px-6 py-3">
        <Link
          href="/"
          title="Página inicial"
          className="flex min-w-fit data-[searchbar=open]:hidden"
          data-searchbar={searchBar ? 'open' : 'closed'}
        >
          <div className="inline-flex items-center gap-2">
            <Image src="/logo.svg" alt="logo.svg" width={40} height={40} quality={80} />
            <div className="">
              <span className="font-alt text-primary text-xl font-medium md:text-4xl">
                GAME
              </span>
              <span className="font-alt text-foreground text-xl font-medium md:text-4xl">
                STORE
              </span>
            </div>
          </div>
        </Link>

        <div
          className="ml-auto hidden items-center data-[searchbar=open]:block data-[searchbar=open]:w-full md:flex"
          data-searchbar={searchBar ? 'open' : 'closed'}
        >
          <Input
            variant="search"
            name="search"
            className="data-[searchbar=open]:bg-background data-[searchbar=open]:ring-0"
            data-searchbar={searchBar ? 'open' : 'closed'}
          >
            <Control
              ref={controlRef}
              type="search"
              name="search"
              id="search"
              autoComplete="off"
              title="Digite para pesquisar em suas notas"
              onChange={handleSearch}
              onBlur={() => setSearchBar(false)}
              defaultValue={searchParams.get('search')?.toString()}
              data-searchbar={searchBar ? 'open' : 'closed'}
              placeholder="Pesquisar..."
              className="data-[searchbar=open]:bg-background ml-1.5"
            />

            <Search className="group-focus-within:text-primary text-border mr-3 size-6 cursor-pointer transition-all" />
          </Input>
        </div>

        <div
          className="flex items-center gap-4 data-[searchbar=open]:hidden"
          data-searchbar={searchBar ? 'open' : 'closed'}
        >
          <Button
            variant="toggle"
            size="toggle"
            title="Barra de pesquisa"
            onClick={() => setSearchBar(true)}
            className="md:hidden"
          >
            <SearchIcon className="text-foreground transition-all" />
          </Button>

          <Button variant="toggle" size="toggle" className="relative">
            <Link href="/cart" title="Carrinho de compras" className="relative">
              <ShoppingCart className="text-foreground transition-all" />
            </Link>
            <div className="bg-destructive absolute bottom-0 right-0 -mb-1 -mr-1 flex size-5 items-center justify-center rounded-full">
              <span className="text-xs font-bold text-white">{cartItems.length}</span>
            </div>
          </Button>

          {!user?.id ? (
            <Button className="py-2.5">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-2 md:px-4"
                title="Entrar na conta"
              >
                <LogIn className="size-6" />
                <span className="hidden md:block">Entrar</span>
              </Link>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger title="Sua conta">
                <Image
                  src={
                    user?.avatar
                      ? `${process.env.NEXT_PUBLIC_URL_API}/${user.avatar}`
                      : '/no_profile.jpg'
                  }
                  alt="No profile"
                  width={40}
                  height={40}
                  className="overflow-hidden rounded-full"
                  priority
                />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                sideOffset={5}
                className="mr-5 min-w-48 data-[state=closed]:animate-[menu-hide_200ms] data-[state=open]:animate-[menu-show_200ms]"
              >
                <h1 className="px-1.5 py-0.5 font-semibold">{`Olá, ${user.username}!`}</h1>

                <DropdownMenuSeparator />

                {user?.isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <Cog className="size-5" />
                      Administrativo
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem asChild>
                  <Link href={`/${user.username}`}>
                    <User2 className="size-5" />
                    Meu perfil
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="text-red-500" onSelect={handleSignOut}>
                  <LogOut className="size-5" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};
