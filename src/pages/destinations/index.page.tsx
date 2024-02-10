import { useContentfulLiveUpdates } from '@contentful/live-preview/react';
import { GetStaticProps, InferGetStaticPropsType } from 'next';

import { CountryCardGrid } from '@src/components/features/country/CountryCardGrid';
import { SeoFields } from '@src/components/features/seo';
import { Container } from '@src/components/shared/container';
import { PageCountryOrder } from '@src/lib/__generated/sdk';
import { client, previewClient } from '@src/lib/client';
import { revalidateDuration } from '@src/pages/utils/constants';
import { getServerSideTranslations } from '@src/pages/utils/get-serverside-translations';

const Page = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const destinations = useContentfulLiveUpdates(props.destinations);
  const countries = useContentfulLiveUpdates(props.countries);

  if (!destinations || !countries) return;

  // Later when we have a lot of content, we can use this to group countries by continents
  // const continents = groupBy(
  //   countries,
  //   (country: PageCountry) => country.continentName || t('destinationPage.otherArticles'),
  // );

  return (
    <>
      {destinations.seoFields && <SeoFields {...destinations.seoFields} />}
      <Container className="my-8 md:mb-10 lg:mb-16">
        <CountryCardGrid countries={countries} />
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, draftMode: preview }) => {
  if (!locale) {
    return {
      notFound: true,
      revalidate: revalidateDuration,
    };
  }

  const gqlClient = preview ? previewClient : client;

  try {
    const [destinationsPageData] = await Promise.all([
      gqlClient.pageDestinations({ locale, preview }),
    ]);

    const destinations = destinationsPageData.pageDestinationsCollection?.items[0];

    if (!destinations) {
      return {
        notFound: true,
        revalidate: revalidateDuration,
      };
    }

    const countriesData = await gqlClient.pageCountryCollection({
      locale,
      order: PageCountryOrder.ContinentNameAsc,
      preview,
    });

    const countries = countriesData.pageCountryCollection?.items;

    return {
      revalidate: revalidateDuration,
      props: {
        ...(await getServerSideTranslations(locale)),
        previewActive: !!preview,
        destinations,
        countries,
      },
    };
  } catch {
    return {
      notFound: true,
      revalidate: revalidateDuration,
    };
  }
};

export default Page;
