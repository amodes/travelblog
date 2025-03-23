import { ReactNode } from 'react';

import { Footer } from '../footer';
import { Header } from '../header';
import ConsentBanner from '../../shared/consentBanner/ConsentBanner';

interface LayoutPropsInterface {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutPropsInterface) => {
  return (
    <>
      <Header />
      <ConsentBanner />
      {children}
      <Footer />
    </>
  );
};
