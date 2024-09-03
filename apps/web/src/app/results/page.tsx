import { Header } from '@/components/header';
import { Main } from '@/components/main';
import { Results } from '@/components/results';

export interface ResultsProps {
  searchParams?: {
    search: string;
    filter: string;
  };
}

export default function ResultsPage({ searchParams }: ResultsProps) {
  return (
    <Main>
      <Header />
      <Results searchParams={searchParams} />
    </Main>
  );
}
