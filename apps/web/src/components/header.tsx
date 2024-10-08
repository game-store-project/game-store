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
import NextLink from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { Link } from './ui/link';

export const Header = () => {
  const [searchBar, setSearchBar] = useState(false);

  const { user, removeUserAndToken } = useAuth();
  const { cartItems, setCartItems } = useCart();

  const controlRef = useRef<HTMLInputElement>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const setParams = (query: string) => {
    const params = new URLSearchParams(searchParams);

    if (query) {
      params.set('search', query);
    } else params.delete('search');

    router.replace(`/results?${params.toString()}`);
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
        <NextLink
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
        </NextLink>

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
            <Search className="group-focus-within:text-primary text-border size-6 cursor-pointer transition-all md:ml-3" />

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
              className="data-[searchbar=open]:bg-background"
            />
          </Input>
        </div>

        <div
          className="flex items-center gap-2 data-[searchbar=open]:hidden md:gap-4"
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

          <Link
            href="/cart"
            title="Carrinho de compras"
            className="relative"
            variant="toggle"
          >
            <ShoppingCart className="text-foreground size-6 transition-all" />
            <div className="bg-destructive pointer-events-none absolute bottom-0 right-0 -mb-1 -mr-1 flex size-5 items-center justify-center rounded-full">
              <span className="text-xs font-bold text-white">{cartItems.length}</span>
            </div>
          </Link>

          {!user?.id ? (
            <Button className="p-0">
              <NextLink
                href="/login"
                className="inline-flex size-full items-center gap-2 px-2 py-2.5 md:px-4"
                title="Entrar na conta"
              >
                <LogIn className="size-6" />
                <span className="hidden md:block">Entrar</span>
              </NextLink>
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
                className="mr-5 min-w-48 max-w-48 data-[state=closed]:animate-[menu-hide_200ms] data-[state=open]:animate-[menu-show_200ms]"
              >
                <h1 className="truncate px-1.5 py-0.5 font-semibold">{`Olá, ${user.username}!`}</h1>

                <DropdownMenuSeparator />

                {user?.isAdmin && (
                  <DropdownMenuItem asChild>
                    <NextLink href="/dashboard">
                      <Cog className="size-5" />
                      Administrativo
                    </NextLink>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem asChild>
                  <NextLink href={`/me/${user.username}`}>
                    <User2 className="size-5" />
                    Meu perfil
                  </NextLink>
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
