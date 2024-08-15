import Image from 'next/image';
import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

interface BannersLinearContainerProps extends ComponentProps<'div'> {}

const BannerImage = ({ path }: { path: string }) => {
  return (
    <Image
      src={path}
      alt={`${path.replace('/', '').split('.')[0]}`}
      width={457}
      height={282}
      className="h-full w-full"
      quality={10}
      priority
    />
  );
};

const BannersLinearContainer = (props: BannersLinearContainerProps) => {
  return (
    <div
      {...props}
      className={twMerge(
        'flex h-full max-h-[calc((100vh-80px-40px)/3)] shrink gap-5 whitespace-nowrap',
        props.className,
      )}
    />
  );
};

interface AuthBannerProps extends ComponentProps<'div'> {}

export const AuthBanner = (props: AuthBannerProps) => {
  return (
    <div
      {...props}
      className={twMerge(
        'hidden h-screen flex-col gap-5 overflow-hidden py-10 md:flex',
        props.className,
      )}
    >
      <BannersLinearContainer className="animate-[infinite-banner_40000ms_infinite_linear] transition-all">
        <BannerImage path={'/control-ultimate.jpg'} />
        <BannerImage path={'/dmc.webp'} />
        <BannerImage path={'/forza5.webp'} />
        <BannerImage path={'/god-of-war.webp'} />
        <BannerImage path={'/control-ultimate.jpg'} />
        <BannerImage path={'/dmc.webp'} />
        <BannerImage path={'/forza5.webp'} />
        <BannerImage path={'/god-of-war.webp'} />
      </BannersLinearContainer>

      <BannersLinearContainer className="animate-[infinite-banner_40000ms_reverse_infinite_linear]">
        <BannerImage path={'/gta5.jpg'} />
        <BannerImage path={'/hogwardslegacy.jpeg'} />
        <BannerImage path={'/mafiadefinitive.jpg'} />
        <BannerImage path={'/nfsheat.jpg'} />
        <BannerImage path={'/gta5.jpg'} />
        <BannerImage path={'/hogwardslegacy.jpeg'} />
        <BannerImage path={'/mafiadefinitive.jpg'} />
        <BannerImage path={'/nfsheat.jpg'} />
      </BannersLinearContainer>

      <BannersLinearContainer className="animate-[infinite-banner_40000ms_infinite_linear]">
        <BannerImage path={'/re-village.webp'} />
        <BannerImage path={'/re4.jpg'} />
        <BannerImage path={'/reddead2.jpg'} />
        <BannerImage path={'/sekiro.jpg'} />
        <BannerImage path={'/re-village.webp'} />
        <BannerImage path={'/re4.jpg'} />
        <BannerImage path={'/reddead2.jpg'} />
        <BannerImage path={'/sekiro.jpg'} />
      </BannersLinearContainer>
    </div>
  );
};
