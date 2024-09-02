import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Home } from '@/components/home';
import { Main } from '@/components/main';

export default function HomePage() {
  return (
    <Main>
      <Header />
      <Home />
      <Footer />
    </Main>
  );
}
