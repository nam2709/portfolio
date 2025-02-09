import { useContext } from 'react'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import ProductBox1Rating from '@/Components/Common/ProductBox/ProductBox1/ProductBox1Rating'
import CustomerOrderCount from '../Common/CustomerOrderCount'
import SettingContext from '@/Helper/SettingContext'
import { NumericFormat } from 'react-number-format'
import { ReviewAPI } from '@/Utils/AxiosUtils/API'
import { useQuery } from '@tanstack/react-query'
import request from '@/Utils/AxiosUtils'
import Cookies from 'js-cookie'

const ProductDetails = ({ productState }) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const isLogin = Cookies.get('uat')
  console.log(productState)
  const { data, isLoading, refetch } = useQuery(
    [ReviewAPI],
    () =>
      request({
        url: ReviewAPI,
        params: { product_id: productState?.product?.id },
      }),
    {
      enabled: isLogin ? (productState?.product?.id ? true : false) : false,
      refetchOnWindowFocus: false,
      select: res => res?.data,
    }
  )
  return (
    <>
      {/* <CustomerOrderCount productState={productState} /> */}
      <h2 className="name mb-3">
        {productState?.selectedVariation?.name ?? productState?.product?.name}
      </h2>
      <div className="price-rating mb-3">
        <h3 className="theme-color price">
          <NumericFormat
            className="span-text-price"
            value={
              productState?.selectedVariation?.sale_price
                ? productState?.selectedVariation?.sale_price
                : productState?.product?.sale_price
            }
            displayType={'text'}
            thousandSeparator={true}
            prefix={''}
          />
          <span className="span-text-price">&#8363;</span>
          <del className="text-content">
            <NumericFormat
              className="span-text-price-sale"
              value={
                productState?.selectedVariation
                  ? productState?.selectedVariation?.price
                  : productState?.product?.price
              }
              displayType={'text'}
              thousandSeparator={true}
              prefix={''}
            />
            <span>&#8363;</span>
          </del>
          {productState?.selectedVariation?.discount ||
          productState?.product?.discount ? (
            <span className="offer-top">
              {productState?.selectedVariation
                ? productState?.selectedVariation?.discount
                : productState?.product?.discount}
              % {t('Off')}
            </span>
          ) : null}
        </h3>
      </div>
      <div className="product-rating custom-rate d-between">
        <div className="mr-3">
            <h6 className="unit ">
              Đã bán {productState?.product?.orders_count}
            </h6>
        </div>
        <ProductBox1Rating
          totalRating={
            (data?.general?.total_rating / data?.general?.rating_count)
          }
        />
        <span className="review">
          {data?.general?.rating_count ||
            0}{' '}
          {t('Review')}
        </span>
      </div>
      <div className="product-contain">
        <p>
          {productState?.selectedVariation?.short_description ??
            productState?.product?.short_description}
        </p>
      </div>
    </>
  )
}

export default ProductDetails
