import Link from 'next/link';

import { CtfImage } from '@src/components/features/contentful';
import { PageCountry } from '@src/lib/__generated/sdk';

export const CountryCard = ({ country }: { country: PageCountry }) => {
  return (
    <>
      {country.slug && (
        <Link key={country.countryName} href={country.slug}>
          <div className="h-72 w-72">
            <div className="flex items-center justify-center">
              {country.squareImage && (
                <CtfImage
                  nextImageProps={{
                    width: 300,
                    height: 300,
                  }}
                  {...country.squareImage}
                />
              )}
              <h3 className="absolute text-4xl text-colorWhite">
                {country.countryName?.toLocaleUpperCase()}
              </h3>
            </div>
          </div>
        </Link>
      )}
    </>
  );
};
