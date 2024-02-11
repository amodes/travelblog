import { CtfImage } from '@src/components/features/contentful';
import { ImageFieldsFragment } from '@src/lib/__generated/sdk';

export const Banner = ({
  image,
  bannerText,
}: {
  image: ImageFieldsFragment;
  bannerText: string;
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
        <h3 className="absolute text-6xl text-colorWhite">{bannerText?.toLocaleUpperCase()}</h3>
      </div>
    </div>
  );
};
