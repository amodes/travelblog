import {
  useContentfulLiveUpdates,
  useContentfulInspectorMode,
} from '@contentful/live-preview/react';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useTranslation } from 'next-i18next';

import { ContinentItem } from './ContinentItem';

import { SeoFields } from '@src/components/features/seo';
import { Container } from '@src/components/shared/container';
import { PageCountry, PageCountryOrder } from '@src/lib/__generated/sdk';
import { client, previewClient } from '@src/lib/client';
import { revalidateDuration } from '@src/pages/utils/constants';
import { getServerSideTranslations } from '@src/pages/utils/get-serverside-translations';
import { groupBy } from '@src/utilities/groupBy';

const Page = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const destinations = useContentfulLiveUpdates(props.destinations);
  const countries = useContentfulLiveUpdates(props.countries);
  const inspectorProps = useContentfulInspectorMode({ entryId: destinations.sys.id });
  const { t } = useTranslation();

  if (!destinations || !countries) return;

  const { title } = destinations;

  const continents = groupBy(
    countries,
    (country: PageCountry) => country.continentName || t('destinationPage.otherArticles'),
  );

  return (
    <>
      {destinations.seoFields && <SeoFields {...destinations.seoFields} />}
      <Container className="my-8  md:mb-10 lg:mb-16">
        <h2 className="mb-4 md:mb-6" {...inspectorProps({ fieldId: 'publishedDate' })}>
          {title}
        </h2>
        {Object.keys(continents).map(continentName => (
          <ContinentItem
            key={continentName}
            continentName={continentName}
            countries={continents[continentName]}
          />
        ))}
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params, locale, draftMode: preview }) => {
  //   if (!params?.slug || !locale) {
  //     return {
  //       notFound: true,
  //       revalidate: revalidateDuration,
  //     };
  //   }

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
