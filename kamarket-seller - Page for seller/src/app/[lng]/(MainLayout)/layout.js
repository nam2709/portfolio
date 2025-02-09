import Layout from '@/Layout'
import { isVendor } from '@/Utils/libs'
import { verifySession } from '@/app/actions/user'
import { redirect } from 'next/navigation'

export default async function RootLayout({ children, params }) {
  const session = await verifySession()

  if (!isVendor(session)) {
    redirect(`/${params.lng}/auth/login`)
  }
  return <Layout lng={params.lng}>{children}</Layout>
}
