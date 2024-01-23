import { GetStaticProps, InferGetStaticPropsType } from 'next';

import {
  useContentfulLiveUpdates,
  useContentfulInspectorMode,
} from '@contentful/live-preview/react';

import { client, previewClient } from '@src/lib/client';
import { revalidateDuration } from '@src/pages/utils/constants';
import { getServerSideTranslations } from '@src/pages/utils/get-serverside-translations';
import { SeoFields } from '@src/components/features/seo';
import { Container } from '@src/components/shared/container';

const Page = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const destinations = useContentfulLiveUpdates(props.destinations);
  const inspectorProps = useContentfulInspectorMode({ entryId: destinations.sys.id });

  if (!destinations) return;

  const { title } = destinations;

  return (
    <>
      {destinations.seoFields && <SeoFields {...destinations.seoFields} />}
      <Container className="my-8  md:mb-10 lg:mb-16">
        <h2 className="mb-4 md:mb-6" {...inspectorProps({ fieldId: 'publishedDate' })}>
          {title}
        </h2>
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

    return {
      revalidate: revalidateDuration,
      props: {
        ...(await getServerSideTranslations(locale)),
        previewActive: !!preview,
        destinations,
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
