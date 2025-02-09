'use client'
import Breadcrumb from '@/Components/Common/Breadcrumb'
import SellerPoster from './SellerPoster'
import SellerService from './SellerService'
import SellerBusiness from './SellerBusiness'
import SellerSelling from './SellerSelling'
import React, { useEffect, useContext } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import AccountContext from '@/Helper/AccountContext'
import I18NextContext from '@/Helper/I18NextContext'

const BecomeSellerContent = () => {
  const { i18Lang } = useContext(I18NextContext)
  const pathname = usePathname()
  const search = useSearchParams()
  const searchparam = search.toString()
  const currentPath = pathname + (searchparam ? `?${searchparam}` : '');

  const { login, auth } = useContext(AccountContext)
  const router = useRouter()

  useEffect(() => {
    const authentication = async () => {
      if (!auth?.userId && i18Lang) {
        const loginPath = `/${i18Lang}/auth/login?redirect=${currentPath}`
        router.push(loginPath);
        return loginPath
      }
    }
    authentication()
  }, [!auth?.userId, i18Lang])

  return (
    <>
      <Breadcrumb
        title={'BecomeVendor'}
        subNavigation={[{ name: 'BecomeVendor' }]}
      />
      {/* <SellerPoster /> */}
      <SellerService />
      <SellerBusiness />
      <SellerSelling />
      
    </>
  )
}

export default BecomeSellerContent
