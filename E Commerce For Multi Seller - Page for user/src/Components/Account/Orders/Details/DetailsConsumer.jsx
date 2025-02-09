import { useContext } from 'react'
import { Card, CardBody, Col, Row } from 'reactstrap'
import I18NextContext from '@/Helper/I18NextContext'
import { ModifyString } from '@/Utils/CustomFunctions/ModifyString'
import { useTranslation } from '@/app/i18n/client'
import { formatCurrency } from '@/Utils/libs'

const DetailsConsumer = ({ data }) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  return (
    <>
      <Row>
        <Col xxl={8} lg={12} md={7}>
          <Card>
            <CardBody>
              <h3 className="fw-semibold mb-3">{t('ConsumerDetails')}</h3>
              <div className="customer-detail tracking-wrapper">
                <ul className="row g-3">
                  {data?.billing_address && (
                    <li className="col-sm-6">
                      <label>{t('BillingAddress')}:</label>
                      <h4>
                        {data.billing_address.street}
                        {', '}
                        {data.billing_address.ward}
                        {', '}
                        {data.billing_address.district}
                        {','}
                        {data.billing_address.city}
                        {t('Phone')} : {data.shipping_address.country_code}{' '}
                        0{data.billing_address.phone}
                      </h4>
                    </li>
                  )}
                  {data?.shipping_address && (
                    <li className="col-sm-6">
                      <label>{t('ShippingAddress')}:</label>
                      <h4>
                        {data.shipping_address.street}
                        <br />
                        {data.shipping_address.ward}
                        {', '}
                        {data.shipping_address.district}
                        {', '}
                        {data.shipping_address.city}
                        <br /> {/* {data.shipping_address.state.name}{' '} */}
                        {/* {data.shipping_address.country.name} */}
                        {/* {data.shipping_address.pincode} <br></br> */}
                        {t('Phone')} : {data.shipping_address?.country_code}{' '}
                        0{data.shipping_address.phone}
                      </h4>
                    </li>
                  )}
                  {data?.delivery_description && (
                    <li className="col-sm-6">
                      <label>{t('DeliverySlot')}:</label>
                      <h4>{data.delivery_description}</h4>
                    </li>
                  )}
                  {data?.payment_method && (
                    <li className="col-3">
                      <label>{t('PaymentMode')}:</label>
                      <div className="d-flex align-items-center gap-2">
                        <h4>{ModifyString(data.payment_method, 'upper')}</h4>
                      </div>
                    </li>
                  )}
                  {data?.payment_status && (
                    <li className="col-3">
                      <label>{t('PaymentStatus')}:</label>
                      <div className="d-flex align-items-center gap-2">
                        <h4>{ModifyString(data.payment_status, 'upper')}</h4>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col xxl={4} lg={12} md={5}>
          <Card className="h-m30">
            <CardBody>
              <h3 className="fw-semibold mb-3">{t('summary')}</h3>
              <div className="tracking-total tracking-wrapper">
                <ul>
                  <li>
                    {t('Subtotal')} <span className='span-text-price'>{formatCurrency(data?.amount || 0)}</span>
                  </li>
                  <li>
                    {t('Shipping')} <span className='span-text-price'>{formatCurrency(data?.shipping_total || 0)}</span>
                  </li>
                  <li>
                    {t('Tax')} <span className='span-text-price'>{formatCurrency(data?.tax_total || 0)}</span>
                  </li>
                  {data?.points_amount && (
                    <li className="txt-primary fw-bold">
                      {t('Points')} <span>{data?.points_amount}</span>
                    </li>
                  )}
                  {data?.wallet_balance && (
                    <li className="txt-primary fw-bold">
                      {t('WalletBalance')}
                      <span>{data?.wallet_balance}</span>
                    </li>
                  )}
                  <li>
                    {t('Total')} <span className='span-text-price'>{formatCurrency(data?.total || data?.amount)}</span>
                  </li>
                </ul>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default DetailsConsumer
