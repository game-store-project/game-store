import Image from 'next/image';
import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

interface DivProps extends ComponentProps<'div'> {}

const BannerImage = ({ path }: { path: string }) => {
  return (
    <Image
      src={path}
      alt={`${path.replace('/', '').split('.')[0]}`}
      width={457}
      height={282}
      className="h-full w-full"
      priority
    />
  );
};

const BannersLinearContainer = (props: DivProps) => {
  return (
    <div
      {...props}
      className={twMerge(
        'flex max-h-[calc((100vh-80px-40px)/3)] gap-5 whitespace-nowrap',
        props.className,
      )}
    />
  );
};

export const AuthBanner = () => {
  return (
    <div className="flex flex-col gap-5 overflow-hidden py-10">
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
