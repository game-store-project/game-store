'use client';

import { ChevronUp } from 'lucide-react';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-secondary mt-24 flex w-full flex-1 flex-col space-y-5 p-4">
      <button
        onClick={scrollToTop}
        className="bottom-4 right-4 z-50 ml-auto border border-white px-2 py-1.5 text-white shadow-lg transition-opacity duration-300 hover:bg-blue-700"
      >
        <ChevronUp className="size-6" />
      </button>

      <p className="text-center">
        © 2024, Game Store, Inc. Todos os direitos reservados.
      </p>
    </footer>
  );
};
