import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {

  render() {
    const { page }: { page: PageProps } = this.props?.__NEXT_DATA__?.props?.pageProps || {};

    return (
      <Html>
        <Head />
        <body style={{ background: page.section === 'archive' ? 'var(--archive)' : 'var(--background)' }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}