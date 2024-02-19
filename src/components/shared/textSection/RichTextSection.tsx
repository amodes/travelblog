import { CtfRichText } from '@src/components/features/contentful';
import { Scalars } from '@src/lib/__generated/sdk';

type Content = {
  json: Scalars['JSON'];
  links: unknown;
};

export const RichTextSection = ({ content }: { content: Content }) => {
  return (
    <div className="border-t border-b border-gray400 py-4 text-center">
      <CtfRichText json={content?.json} links={content?.links} />
    </div>
  );
};
