import { Main } from '@/components/main';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <Main>
        <header className="border-border flex border-b px-6 py-4">
          <div className="mx-auto w-full max-w-[1200px]">
            <div className="inline-flex items-center gap-2">
              <Image src="/logo.svg" alt="logo.svg" width={40} height={40} quality={80} />
              <span className="font-alt text-primary text-4xl font-medium">
                GAME<span className="text-foreground">STORE</span>
              </span>
            </div>
          </div>
        </header>
      </Main>
    </div>
  );
}
