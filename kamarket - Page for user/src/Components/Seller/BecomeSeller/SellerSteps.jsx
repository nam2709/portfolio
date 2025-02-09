import { Col } from 'reactstrap'
import { useContext } from 'react'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'

const SellerSteps = ({ data, number }) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  return (
    <Col xl={4} sm={6}>
      <div className="business-box">
        <div>
          <div className="business-number">
            <h2>{number}</h2>
          </div>
          <div className="business-detail">
            <h4>{t(data?.title)}</h4>
            <p>{t(data?.description)}</p>
          </div>
        </div>
      </div>
    </Col>
  )
}

export default SellerSteps
