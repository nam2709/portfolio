import '../../../public/assets/scss/app.scss'
import I18NextProvider from '@/Helper/I18NextContext/I18NextProvider'
import TanstackWrapper from '@/Layout/TanstackWrapper'
import ConfigureAmplifyClientSide from '@/Utils/ConfigureAmplifyClientSide'
// import { headers } from 'next/headers'

export async function generateMetadata() {
  // const protol = headers().get('x-forwarded-proto') || 'http'
  // const host = headers().get('host')
  // const api_url = `${protol}://${host}/api`
  // fetch data
  const host_url = process.env.API_PROD_URL || process.env.HOST_API_URL
  const settingData = await fetch(`${host_url}/settings`)
    .then(res => res.json())
    .catch(err => console.log('err', err))
  return {
    metadataBase: new URL(host_url),
    title: settingData?.values?.general?.site_title,
    description: settingData?.values?.general?.site_tagline,
    icons: {
      icon: settingData?.values?.general?.favicon_image?.original_url,
      link: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Public+Sans&display=swap',
      },
    },
  }
}

export default function RootLayout({ children, params: { lng } }) {
  return (
    <html lang={lng}>
      <body suppressHydrationWarning={true}>
        <ConfigureAmplifyClientSide />
        <I18NextProvider>
          <TanstackWrapper>{children}</TanstackWrapper>
        </I18NextProvider>
      </body>
    </html>
  )
}
