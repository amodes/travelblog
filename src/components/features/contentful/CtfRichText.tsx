import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, Document } from '@contentful/rich-text-types';

import { ArticleImage } from '@src/components/features/article';
import { ComponentRichImage } from '@src/lib/__generated/sdk';

export type EmbeddedEntryType = ComponentRichImage | null;

export interface ContentfulRichTextInterface {
  json: Document;
  links?:
    | {
        entries: {
          block: Array<EmbeddedEntryType>;
        };
      }
    | any;
}

export const EmbeddedEntry = (entry: EmbeddedEntryType) => {
  switch (entry?.__typename) {
    case 'ComponentRichImage':
      return <ArticleImage image={entry} />;
    default:
      return null;
  }
};

export const contentfulBaseRichTextOptions = ({ links }: ContentfulRichTextInterface): Options => ({
  renderNode: {
    [BLOCKS.EMBEDDED_ENTRY]: node => {
      const entry = links?.entries?.block?.find(
        (item: EmbeddedEntryType) => item?.sys?.id === node.data.target.sys.id,
      );

      if (!entry) return null;

      return <EmbeddedEntry {...entry} />;
    },
    [BLOCKS.HEADING_1]: (node, children) => <h1 className="font-normal">{children}</h1>,
    [BLOCKS.HEADING_2]: (node, children) => <h2 className="font-normal">{children}</h2>,
    [BLOCKS.HEADING_3]: (node, children) => <h3 className="font-normal">{children}</h3>,
    [BLOCKS.HEADING_4]: (node, children) => <h4 className="font-normal">{children}</h4>,
    [BLOCKS.HEADING_5]: (node, children) => <h5 className="font-normal">{children}</h5>,
    [BLOCKS.HEADING_6]: (node, children) => <h6 className="font-normal">{children}</h6>,
  },
});

export const CtfRichText = ({ json, links }: ContentfulRichTextInterface) => {
  const baseOptions = contentfulBaseRichTextOptions({ links, json });

  return (
    <article className="prose prose-sm max-w-none">
      {documentToReactComponents(json, baseOptions)}
    </article>
  );
};
