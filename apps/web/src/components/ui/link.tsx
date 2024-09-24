import NextLink from 'next/link';
import { ComponentProps } from 'react';
import { tv, VariantProps } from 'tailwind-variants';

const link = tv({
  base: 'active:transiction-none flex items-center justify-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-sm font-medium outline-none transition-all focus-visible:ring-1 focus-visible:ring-foreground',

  variants: {
    variant: {
      default: 'hover:border-secondary active:bg-secondary/80',
      primary: 'bg-primary text-purple-50 hover:bg-primary/90 active:bg-primary/80',
      toggle:
        'group rounded-full bg-secondary/60 hover:bg-secondary hover:ring-primary focus-visible:ring-primary active:bg-secondary/80 p-2.5',
    },
  },

  defaultVariants: {
    variant: 'default',
  },
});

interface LinkProps extends ComponentProps<typeof NextLink>, VariantProps<typeof link> {}

export const Link = ({ className, variant, ...props }: LinkProps) => {
  return <NextLink {...props} className={link({ variant, className })} />;
};
