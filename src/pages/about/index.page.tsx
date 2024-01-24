import {
  useContentfulLiveUpdates,
  useContentfulInspectorMode,
} from '@contentful/live-preview/react';
import { GetStaticProps, InferGetStaticPropsType } from 'next';

import { CtfRichText, CtfImage } from '@src/components/features/contentful';
import { SeoFields } from '@src/components/features/seo';
import { Container } from '@src/components/shared/container';
import { client, previewClient } from '@src/lib/client';
import { revalidateDuration } from '@src/pages/utils/constants';
import { getServerSideTranslations } from '@src/pages/utils/get-serverside-translations';

const Page = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const about = useContentfulLiveUpdates(props.about);
  const inspectorProps = useContentfulInspectorMode({ entryId: about.sys.id });

  if (!about) return;

  const { title, content, banner } = about;

  return (
    <>
      {about.seoFields && <SeoFields {...about.seoFields} />}
      <Container>
        {banner && (
          <div className="mb-4" {...inspectorProps({ fieldId: 'featuredImage' })}>
            <CtfImage nextImageProps={{ className: 'object-cover w-full' }} {...banner} />
          </div>
        )}
        <h2 className="mb-4 md:mb-6" {...inspectorProps({ fieldId: 'publishedDate' })}>
          {title}
        </h2>

        <div {...inspectorProps({ fieldId: 'content' })}>
          <CtfRichText json={content?.json} links={content?.links} />
        </div>
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
    const [aboutPageData] = await Promise.all([gqlClient.pageAbout({ locale, preview })]);

    const about = aboutPageData.pageAboutCollection?.items[0];

    if (!about) {
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
        about,
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
