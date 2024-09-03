import { formatPrice } from '@/utils/price';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ComponentProps } from 'react';

interface ButtonProps extends ComponentProps<'button'> {
  title: string;
  slug: string;
  price: number;
  year: number;
  imageUrl: string;
}

export const CardGame = ({
  title,
  slug,
  price,
  year,
  imageUrl,
  ...props
}: ButtonProps) => {
  const truncatedTitle = title.length > 35 ? title.slice(0, 35).concat('...') : title;

  return (
    <Link
      className="bg-secondary flex max-w-[157px] flex-col gap-2 rounded-xl pb-4 md:max-w-[192px]"
      href={`/${slug}`}
    >
      <Image
        src={`${process.env.NEXT_PUBLIC_URL_API}/${imageUrl}`}
        className="rounded-t-xl"
        alt={slug}
        quality={30}
        width={192}
        height={110}
      />
      <div className="flex flex-1 flex-col justify-between px-2">
        <div>
          <h3 className="font-normal">{truncatedTitle}</h3>
          <p className="text-primary font-semibold">{year}</p>
        </div>

        <div className="mt-auto">
          <button
            {...props}
            className="bg-border/50 hover:bg-destructive hover:border-destructive mx-auto mt-5 flex h-9 w-full max-w-40 items-center justify-center gap-2 rounded-lg border border-gray-800 px-4 font-medium transition-colors duration-500"
          >
            <ShoppingCart className="size-5" />
            {formatPrice(price)}
          </button>
        </div>
      </div>
    </Link>
  );
};
