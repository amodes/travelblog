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
  const about = useContentfulLiveUpdates(props.about);
  const inspectorProps = useContentfulInspectorMode({ entryId: about.sys.id });

  if (!about) return;

  const { title, content, banner } = about;

  return (
    <>
      {about.seoFields && <SeoFields {...about.seoFields} />}
      <Container>
        {banner && (
          <Banner
            image={banner}
            bannerText={title}
            icon={<BlogLogoWhite className="h-10 w-10 lg:mr-2 lg:h-20 lg:w-20" />}
            smallMobileFontSize
          />
        )}
        <div className="mt-6" {...inspectorProps({ fieldId: 'content' })}>
          <CtfRichText json={content?.json} links={content?.links} />
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
    const aboutPageData = await gqlClient.pageAbout({ locale, preview });

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
