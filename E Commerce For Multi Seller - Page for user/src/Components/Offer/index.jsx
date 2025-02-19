'use client'
import { useContext } from 'react'
import { Col } from 'reactstrap'
import Breadcrumb from '../Common/Breadcrumb'
import WrapperComponent from '../Common/WrapperComponent'
import { CouponAPI } from '@/Utils/AxiosUtils/API'
import { useQuery } from '@tanstack/react-query'
import request from '@/Utils/AxiosUtils'
import Btn from '@/Elements/Buttons/Btn'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import OfferSkeleton from './OfferSkeleton'

const Offer = () => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const { data, refetch, isLoading } = useQuery(
    [CouponAPI],
    () => request({ url: CouponAPI, params: { status: 1 } }),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      select: data => data.data.data,
    }
  )

  const onCopyCode = couponData => {
    navigator.clipboard.writeText(couponData)
  }
  return (
    <>
      <Breadcrumb
        title={'Mã Giảm Giá'}
        subNavigation={[{ name: 'Mã Giảm Giá' }]}
      />
      {isLoading ? (
        <OfferSkeleton />
      ) : (
        <WrapperComponent
          classes={{
            sectionClass: 'section-b-space section-t-space offer-section',
            row: 'g-md-4 g-3',
          }}
          customCol={true}
        >
          {data?.length > 0
            ? data?.map((coupon, i) => (
                <Col xxl={3} lg={4} sm={6} key={i}>
                  <div className="coupon-box">
                    <div className="coupon-name">
                      <div className="card-name">
                        <div>
                          <h5 className="fw-semibold dark-text">
                            {coupon.title}
                          </h5>
                        </div>
                      </div>
                    </div>
                    <div className="coupon-content">
                      <p className="p-0">{coupon.description}</p>
                      <div className="coupon-apply">
                        <h6 className="coupon-code success-color">
                          #{coupon.code}
                        </h6>
                        <Btn
                          className="theme-btn border-btn copy-btn mt-0"
                          onClick={() => onCopyCode(coupon.code)}
                        >
                          {t('CopyCode')}
                        </Btn>
                      </div>
                    </div>
                  </div>
                </Col>
              ))
            : 'No Data'}
        </WrapperComponent>
      )}
    </>
  )
}

export default Offer
