import { useContext, useState, useEffect } from 'react'
import { Col, Progress, Row } from 'reactstrap'
import Cookies from 'js-cookie'
import { RiStarFill } from 'react-icons/ri'
import { useQuery } from '@tanstack/react-query'
import Btn from '@/Elements/Buttons/Btn'
import request from '@/Utils/AxiosUtils'
import { ReviewAPI } from '@/Utils/AxiosUtils/API'
import CustomerQA from './CustomerQ&A'
import ReviewModal from './AllModal/ReviewModal'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import { isCanReview } from './isCanReview'

const CustomerReview = ({ productState }) => {
  const [canReview, setCanReview] = useState(false);
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const [modal, setModal] = useState('')
  const isLogin = Cookies.get('uat')
  const { data, isLoading, refetch } = useQuery(
    [ReviewAPI, productState?.product?.id],
    () =>
      request({
        url: ReviewAPI,
        params: { product_id: productState?.product?.id },
      }),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      select: res => res?.data,
    }
  )

  useEffect(() => {
    // Make sure to handle null or undefined product ID
    if (productState?.product?.id) {
      isCanReview(productState.product.id).then(result => {
        setCanReview(result);
      }).catch(error => {
        console.error("Error checking review status:", error);
        setCanReview(false);
      });
    }
  }, [productState?.product?.id]);

  console.log('review data', data)
  return (
    <>
      <Col xl={3}>
        <div className="product-rating-box">
          <Row>
              <Col xl={12}>
                <div className="product-main-rating">
                  <h2>
                    {!data?.general?.total_rating ? "0.00" : (data?.general?.total_rating / data?.general?.rating_count).toFixed(2)}
                    <RiStarFill />
                  </h2>
                  <h5>
                    {data?.general?.rating_count || 0} {t('Ratings')}
                  </h5>
                </div>
              </Col>
            <Col xl={12}>
              <ul className="product-rating-list">
                {[5, 4, 3, 2, 1].map(rating => (
                  <li key={rating}>
                    <div className="rating-product">
                      <h5>
                        {rating || 0}
                        <RiStarFill />
                      </h5>
                      <Progress multi>
                        <Progress
                          value={(
                            (data?.general?.[`rating_${rating}`] / data?.general?.rating_count) *
                            100
                          ).toFixed(0) || 0}
                        />
                      </Progress>
                      <h5 className="total">{data?.general?.[`rating_${rating}`] || 0}</h5>
                    </div>
                  </li>
                ))}
              </ul>
              {canReview ? (
                <div className="review-title-2">
                  <h4 className="fw-bold">{t('Reviewthisproduct')}</h4>
                  <p>{t('Letothercustomersknowwhatyouthink')}.</p>
                  <Btn
                    className="btn"
                    onClick={() => setModal(productState?.product?.id)}
                    title={
                      productState?.product?.user_review
                        ? t('EditReview')
                        : t('Writeareview')
                    }
                  />
                </div>
              ) : (
                <div className="review-title-2">
                  <h4 className="fw-bold">{t('Reviewthisproduct')}</h4>
                </div>
              )}
            </Col>
          </Row>
        </div>
      </Col>
      <ReviewModal
        modal={modal}
        setModal={setModal}
        productState={productState}
        refetch={refetch}
      />
      <Col xl={9}>
        <CustomerQA data={data?.review} />
      </Col>
    </>
  )
}

export default CustomerReview
