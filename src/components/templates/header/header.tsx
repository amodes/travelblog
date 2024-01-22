import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import BlogLogo from '@icons/blog-logo.svg';
import { LanguageSelector } from '@src/components/features/language-selector';
import { Container } from '@src/components/shared/container';

export const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="py-5">
      <nav>
        <Container className="flex items-center justify-between">
          <Link href="/" title={t('common.homepage')}>
            <div className="flex items-center">
              <BlogLogo className="h-10 w-10 lg:mr-2 lg:h-12 lg:w-12" />
              <h2 className="hidden md:block">Unlimited Hills</h2>
            </div>
          </Link>
          <Link className="mr-2" href="/">
            <h3>Travel blog</h3>
          </Link>
          <Link className="mr-2" href="/destinations">
            <h3>Destinations</h3>
          </Link>
          <Link href="/about">
            <h3>About</h3>
          </Link>
          <LanguageSelector />
        </Container>
      </nav>
    </header>
  );
};
