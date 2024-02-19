import { useContentfulLiveUpdates } from '@contentful/live-preview/react';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { useTranslation } from 'next-i18next';

import { getServerSideTranslations } from '../utils/get-serverside-translations';

import { ArticleTileGrid } from '@src/components/features/article';
import { SeoFields } from '@src/components/features/seo';
import { Banner } from '@src/components/shared/banners/Banner';
import { Container } from '@src/components/shared/container';
import { RichTextSection } from '@src/components/shared/textSection/RichTextSection';
import { client, previewClient } from '@src/lib/client';
import { revalidateDuration } from '@src/pages/utils/constants';

const Page = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const countryPage = useContentfulLiveUpdates(props.countryPage);
  const { t } = useTranslation();

  const relatedPosts = countryPage?.relatedBlogPostsCollection?.items;

  if (!countryPage) return null;

  return (
    <>
      {countryPage.seoFields && <SeoFields {...countryPage.seoFields} />}
      <Container className="my-2 md:mb-10 lg:mb-16">
        <div className="mb-10">
          <Banner image={countryPage.bannerImage} bannerText={countryPage.countryName} />
        </div>
        <RichTextSection content={countryPage.content} />
        <h2 className="mt-10">
          {countryPage.countryName} {t('countryPage.travelBlogs')}
        </h2>
        <ArticleTileGrid className="mt-6 md:grid-cols-2 lg:grid-cols-3" articles={relatedPosts} />
      </Container>
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
    const countryPageData = await gqlClient.pageCountry({
      slug: params.slug.toString(),
      locale,
      preview,
    });

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
