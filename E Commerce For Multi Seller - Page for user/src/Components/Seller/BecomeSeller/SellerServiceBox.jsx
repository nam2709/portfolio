import Image from 'next/image'
import { Col } from 'reactstrap'
import { useContext } from 'react'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'

const SellerServiceBox = ({ data }) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  return (
    <Col xxl={3} lg={4} sm={6}>
      <div className="service-box">
        <div className="service-svg">
          {data?.image_url && (
            <Image
              src={data?.image_url}
              height={60}
              width={60}
              alt={data?.title || 'Seller'}
            />
          )}
        </div>
        <div className="service-detail">
          <h4>{t(data?.title)}</h4>
          <p>{t(data?.description)}</p>
        </div>
      </div>
    </Col>
  )
}

export default SellerServiceBox
