import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import { useContext } from 'react'
import { RiMailLine, RiSmartphoneLine, RiMapPinLine } from 'react-icons/ri'

const StoreVendor = ({ elem, data }) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  console.log('vendor  info', data)
  return (
    <>
      {/* {(Boolean(!elem?.hide_vendor_email) ||
        Boolean(!elem?.hide_vendor_phone)) && ( */}
        <div className="seller-contact-details">
          {/* {Boolean(!elem?.hide_vendor_email) && ( */}
            {/* <div className="saller-contact">
              <div className="seller-icon">
                <RiSmartphoneLine />
              </div>

              <div className="contact-detail">
                <h5>
                  {t('ContactUS')} : <span> {data?.phone}</span>
                </h5>
              </div>
            </div> */}
          {/* )} */}

          {/* {Boolean(!elem?.hide_vendor_phone) && ( */}
            <div className="saller-contact">
              <div className="seller-icon">
                <RiMailLine />
              </div>
              <div className="contact-detail">
                <h5>
                  {t('Email')}: <span> {data?.email}</span>
                </h5>
              </div>
            </div>
          {/* )} */}

          {/* {Boolean(!elem?.hide_vendor_phone) && ( */}
            <div className="saller-contact">
              <div className="seller-icon">
                <RiMapPinLine />
              </div>
              <div className="contact-detail">
                <h5>
                  {t('Address')}: <span> {data?.city}</span>
                </h5>
              </div>
            </div>
          {/* )} */}
        </div>
      {/* )} */}
    </>
  )
}

export default StoreVendor
