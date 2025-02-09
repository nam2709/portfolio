'use client'
import { useContext } from 'react'
import Breadcrumb from '../Common/Breadcrumb'
import ThemeOptionContext from '@/Helper/ThemeOptionsContext'
import Loader from '@/Layout/Loader'
import MainCollection from './MainCollection'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'

const PreOrder = () => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const { isLoading } = useContext(ThemeOptionContext)
  if (isLoading) return <Loader />
  return (
    <>
      <Breadcrumb
        title={t('PRE-ORDER')}
        subNavigation={[{ name: 'PRE-ORDER' }]}
      />
      <div className="container-fluid-lg pt-4 pb-4">
        <MainCollection />
      </div>
    </>
  )
}

export default PreOrder