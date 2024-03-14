import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import { Container } from '@src/components/shared/container';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t-color mt-10 border-t border-gray400">
      <Container className="flex gap-x-10 py-8">
        <div>
          <div className="max-w-4xl">{t('footer.description')}</div>
        </div>
        <div>
          <Link href="/about" className="sm:hidden">
            <div className="max-w-4xl">{t('header.about')}</div>
          </Link>
          <Link className="flex flex-col" href={`/imprint`}>
            <div className="max-w-4xl">{t('footer.imprint')}</div>
          </Link>
        </div>
      </Container>
    </footer>
  );
};
