import '../../../public/assets/scss/app.scss'
import I18NextProvider from '@/Helper/I18NextContext/I18NextProvider'
import TanstackWrapper from '@/Layout/TanstackWrapper'
import ConfigureAmplifyClientSide from '@/Utils/ConfigureAmplifyClientSide'
import { getHost } from '@/Utils/server-utils'

export async function generateMetadata() {
  // fetch data
  const host_url = getHost()
  const api_url = `${host_url}/api`
  const settingData = await fetch(`${api_url}/settings`)
    .then(res => res.json())
    .catch(err => console.log('error while getting settings', err))
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
