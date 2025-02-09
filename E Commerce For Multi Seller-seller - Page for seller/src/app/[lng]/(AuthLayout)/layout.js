import { redirect } from 'next/navigation'

import AuthLayout from '@/Layout/AuthLayout'
import { verifySession } from '@/app/actions/user'
import { isVendor } from '@/Utils/libs'

export default async function Layout({ children, params }) {
  const session = await verifySession()

  if (isVendor(session)) {

    redirect(`/${params.lng}/dashboard`)
  }

  return <AuthLayout lng={params.lng}>{children}</AuthLayout>
}
