import {
  useContentfulLiveUpdates,
  useContentfulInspectorMode,
} from '@contentful/live-preview/react';
import { GetStaticProps, InferGetStaticPropsType } from 'next';

import BlogLogoWhite from '@icons/blog-logo-white.svg';
import { CtfRichText } from '@src/components/features/contentful';
import { SeoFields } from '@src/components/features/seo';
import { Banner } from '@src/components/shared/banners/Banner';
import { Container } from '@src/components/shared/container';
import { client, previewClient } from '@src/lib/client';
import { revalidateDuration } from '@src/pages/utils/constants';
import { getServerSideTranslations } from '@src/pages/utils/get-serverside-translations';

const Page = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const imprint = useContentfulLiveUpdates(props.imprint);
  const inspectorProps = useContentfulInspectorMode({ entryId: imprint.sys.id });

  if (!imprint) return;

  const { wholePageContent } = imprint;

  return (
    <>
      <Container>
        <div className="mt-6" {...inspectorProps({ fieldId: 'content' })}>
          <CtfRichText json={wholePageContent?.json} links={wholePageContent?.links} />
        </div>
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params, locale, draftMode: preview }) => {
  if (!locale) {
    return {
      notFound: true,
      revalidate: revalidateDuration,
    };
  }

  const gqlClient = preview ? previewClient : client;

  try {
    const imprintPageData = await gqlClient.pageImprint({ locale, preview });

    const imprint = imprintPageData.pageImprintCollection?.items[0];

    if (!imprint) {
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
        imprint,
      },
    };
  } catch (e) {
    return {
      notFound: true,
      revalidate: revalidateDuration,
    };
  }
};

export default Page;
