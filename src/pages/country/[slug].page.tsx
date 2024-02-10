import { useContentfulLiveUpdates } from '@contentful/live-preview/react';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { useTranslation } from 'next-i18next';

import { getServerSideTranslations } from '../utils/get-serverside-translations';

import { SeoFields } from '@src/components/features/seo';
import { Container } from '@src/components/shared/container';
import { client, previewClient } from '@src/lib/client';
import { revalidateDuration } from '@src/pages/utils/constants';

const Page = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  const countryPage = useContentfulLiveUpdates(props.countryPage);
  if (!countryPage) return null;

  return (
    <>
      {countryPage.seoFields && <SeoFields {...countryPage.seoFields} />}
      <Container>{countryPage.countryName}</Container>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params, locale, draftMode: preview }) => {
  if (!params?.slug || !locale) {
    return {
      notFound: true,
      revalidate: revalidateDuration,
    };
  }

  const gqlClient = preview ? previewClient : client;
  try {
    const [countryPageData] = await Promise.all([
      gqlClient.pageCountry({ slug: params.slug.toString(), locale, preview }),
      // gqlClient.pageLanding({ locale, preview }),
    ]);

    const countryPage = countryPageData.pageCountryCollection?.items[0];

    if (!countryPage) {
      return {
        notFound: true,
        revalidate: revalidateDuration,
      };
    }

    return {
      revalidate: revalidateDuration,
      props: {
        ...(await getServerSideTranslations(locale)),
        previewActive: !!preview,
        countryPage,
      },
    };
  } catch (e) {
    console.log('eerrorr', e);
    return {
      notFound: true,
      revalidate: revalidateDuration,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const dataPerLocale = locales
    ? await Promise.all(locales.map(locale => client.pageCountryCollection({ locale, limit: 100 })))
    : [];

  const paths = dataPerLocale
    .flatMap((data, index) =>
      data.pageCountryCollection?.items.map(country =>
        country?.slug
          ? {
              params: {
                slug: country.slug,
              },
              locale: locales?.[index],
            }
          : undefined,
      ),
    )
    .filter(Boolean);

  return {
    paths,
    fallback: 'blocking',
  };
};

export default Page;
