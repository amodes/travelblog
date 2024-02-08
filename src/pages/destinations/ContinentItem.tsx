import Link from 'next/link';

import { PageCountry } from '@src/lib/__generated/sdk';

export const ContinentItem = ({
  continentName,
  countries,
}: {
  continentName: string;
  countries: PageCountry[];
}) => {
  return (
    <>
      <h2 key={continentName}>{continentName}</h2>
      {countries.map(
        country =>
          country.slug && (
            <Link key={country.countryName} href={country.slug}>
              <h3>{country.countryName}</h3>
            </Link>
          ),
      )}
    </>
  );
};
