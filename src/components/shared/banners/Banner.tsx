import { CtfImage } from '@src/components/features/contentful';
import { ImageFieldsFragment } from '@src/lib/__generated/sdk';

export const Banner = ({
  image,
  bannerText,
  icon,
  smallMobileFontSize,
}: {
  image: ImageFieldsFragment;
  bannerText: string;
  icon?: JSX.Element;
  smallMobileFontSize?: boolean;
}) => {
  return (
    <div className="h-full w-full">
      <div className="flex items-center justify-center">
        <CtfImage
          {...image}
          nextImageProps={{
            className: 'w-full',
          }}
        />
        <div className="absolute flex-col items-center justify-center">
          <h3
            className={`${
              smallMobileFontSize ? 'text-3xl ' : 'text-4xl '
            }lg:text-6xl text-colorWhite`}
          >
            {bannerText?.toLocaleUpperCase()}
          </h3>
          <div className="flex w-full justify-center lg:mt-6">{icon && icon}</div>
        </div>
      </div>
    </div>
  );
};
