import '/lib/styles/index.scss'
import { Layout } from '/components';
import { PageProvider } from '/lib/context/page'
import { NextIntlProvider } from 'next-intl';
import { DefaultDatoSEO } from 'dato-nextjs-utils/components';
import { sv, enGB as en } from 'date-fns/locale'
import setDefaultOptions from 'date-fns/setDefaultOptions';
import { useRouter } from 'next/router';
import { locales } from '/lib/i18n'
import { useEffect } from 'react';

setDefaultOptions({ locale: en })
function onMessageError() { }
function getMessageFallback({ namespace, key, error }) { return '' }

function App({ Component, pageProps, router }) {

  setDefaultOptions({ locale: router.locale === 'sv' ? sv : en })

  const siteTitle = 'Baltic Art Center'
  const page = pageProps.page || {} as PageProps

  const { asPath } = useRouter()
  const isHome = asPath === '/' || locales.find(l => asPath === `/${l}`) !== undefined
  const errorCode = parseInt(router.pathname.replace('/', ''))
  const isError = (!isNaN(errorCode) && (errorCode > 400 && errorCode < 600)) || router.pathname.replace('/', '') === '_error'

  useEffect(() => {
    document.body.style.background = page.section === 'archive' ? 'var(--archive)' : 'var(--background)'
  }, [page])

  if (isError) return <Component {...pageProps} />

  return (
    <>
      <DefaultDatoSEO siteTitle={siteTitle} site={pageProps.site} path={asPath} />
      <NextIntlProvider messages={pageProps.messages} onError={onMessageError} getMessageFallback={getMessageFallback}>
        <PageProvider value={{ ...page, isHome }}>
          <Layout title={siteTitle} menu={pageProps.menu || []} contact={pageProps.contact}>
            <Component {...pageProps} />
          </Layout>
        </PageProvider>
      </NextIntlProvider>
    </>
  );
}

export default App;
