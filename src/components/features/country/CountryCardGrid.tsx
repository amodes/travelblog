import { CountryCard } from './CountryCard';

import { PageCountry } from '@src/lib/__generated/sdk';

export const CountryCardGrid = ({ countries }: { countries: PageCountry[] }) => {
  return (
    <div className="flex flex-wrap gap-4 lg:gap-8">
      {countries.map(country => (
        <CountryCard key={country.countryName} country={country} />
      ))}
    </div>
  );
};
