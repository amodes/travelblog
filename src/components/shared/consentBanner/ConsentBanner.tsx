import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ConsentBanner = () => {
  const { t } = useTranslation();
  const [consentGiven, setConsentGiven] = useState<boolean | null>(null);

  useEffect(() => {
    const storedConsent = localStorage.getItem('gdprConsent');
    if (storedConsent) {
      setConsentGiven(storedConsent === 'true');
      if (storedConsent === 'true') {
        initializeGoogleAnalytics();
      }
    }
  }, []);

  const initializeGoogleAnalytics = () => {
    const gtmScript = document.createElement('script');
    gtmScript.async = true;
    gtmScript.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`;
    document.head.appendChild(gtmScript);

    const scriptContent = document.createElement('script');
    scriptContent.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
    `;
    document.head.appendChild(scriptContent);
  };

  const handleAccept = () => {
    localStorage.setItem('gdprConsent', 'true');
    setConsentGiven(true);
    initializeGoogleAnalytics();
  };

  const handleDecline = () => {
    localStorage.setItem('gdprConsent', 'false');
    setConsentGiven(false);
  };

  if (consentGiven !== null) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 mb-4 flex items-center justify-center">
      <div className="w-full max-w-sm rounded-lg bg-gray100 p-4 text-center shadow-lg">
        <p className="mb-2 text-sm">{t('consentBanner.message')}</p>
        <button
          onClick={handleAccept}
          className="text-white mr-2 rounded-lg px-4 py-2 text-sm font-bold"
        >
          {t('consentBanner.accept')}
        </button>
        <button onClick={handleDecline} className="text-white rounded px-3 py-1 text-sm">
          {t('consentBanner.decline')}
        </button>
      </div>
    </div>
  );
};

export default ConsentBanner;
