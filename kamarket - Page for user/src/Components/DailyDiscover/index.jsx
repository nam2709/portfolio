'use client'
import { useContext } from 'react'
import Breadcrumb from '../Common/Breadcrumb'
import ThemeOptionContext from '@/Helper/ThemeOptionsContext'
import Loader from '@/Layout/Loader'
import MainCollection from './MainCollection'
import { useTranslation } from '@/app/i18n/client'
import I18NextContext from '@/Helper/I18NextContext'

const DailyDiscover = () => {
  const { isLoading } = useContext(ThemeOptionContext)
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  if (isLoading) return <Loader />
  return (
    <>
      <Breadcrumb
        title={t('Gợi Ý Hôm Nay')}
        subNavigation={[{ name: 'daily-discover' }]}
      />
      <div className="container-fluid-lg pt-4 pb-4">
        <MainCollection />
      </div>
    </>
  )
}

export default DailyDiscover
