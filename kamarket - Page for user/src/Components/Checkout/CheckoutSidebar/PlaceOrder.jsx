import React, { useContext } from 'react'
import Btn from '@/Elements/Buttons/Btn'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import { useRouter } from 'next/navigation'

const PlaceOrder = ({ values, onClick, isOpen }) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const router = useRouter()
  // const handleClick = async () => {
  //   //TODO: do checkout here
  //   router.push(`/${i18Lang}/account/order/1000`)
  // }
  return (
    <>
    {!isOpen  
      ? <Btn className="btn-md fw-bold mt-4 text-white w-100" style={{ background: '#bbe5da' }}>
          {t('PlaceOrder')}
        </Btn> 
      : <Btn className="btn-md fw-bold mt-4 text-white theme-bg-color w-100" onClick={onClick}>
          {t('PlaceOrder')}
        </Btn>}
    </>
  )
}

export default PlaceOrder
