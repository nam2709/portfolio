import I18NextProvider from '@/Helper/I18NextContext/I18NextProvider'
import '../../../public/assets/scss/app.scss'
import NoSSR from '@/Utils/NoSSR'
import favicon from '../../../public/assets/images/favicon/1.png'
import ConfigureAmplifyClientSide from '@/Utils/ConfigureAmplifyClientSide'
export async function generateMetadata() {
  // fetch data
  const themeOption = await fetch(`${process.env.API_PROD_URL}themeOptions`)
    .then(res => res.json())
    .catch(err => console.log('err', err))
  return {
    metadataBase: new URL(process.env.API_PROD_URL),
    title: themeOption?.options?.seo?.title,
    description: themeOption?.options?.seo?.description,
    icons: {
      icon: favicon.src,
      link: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Public+Sans&display=swap',
      },
    },
    openGraph: {
      title: themeOption?.options?.seo?.og_title,
      description: themeOption?.options?.seo?.og_description,
      images: [themeOption?.options?.seo?.og_image?.original_url, []],
    },
  }
}

export default function CustomLayout({ children, params: { lng } }) {
  return (
    <>
      <html lang={lng}>
        <head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Public+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap"
          />
        </head>
        <body suppressHydrationWarning={true}>
          <ConfigureAmplifyClientSide />
          <I18NextProvider>
            {/* <NoSSR>{children}</NoSSR> */}
            {children}
          </I18NextProvider>
        </body>
      </html>
    </>
  )
}
