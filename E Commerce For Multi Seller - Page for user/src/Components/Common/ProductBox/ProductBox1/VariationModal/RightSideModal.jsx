import I18NextContext from '@/Helper/I18NextContext'
import SettingContext from '@/Helper/SettingContext'
import TextLimit from '@/Utils/CustomFunctions/TextLimit'
import { useTranslation } from '@/app/i18n/client'
import { useContext } from 'react'
import { Label } from 'reactstrap'
import ProductBox1Rating from '../ProductBox1Rating'
import { ModifyString } from '@/Utils/CustomFunctions/ModifyString'
import { NumericFormat } from 'react-number-format'

const RightVariationModal = ({ cloneVariation }) => {
  const { convertCurrency } = useContext(SettingContext)
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  return (
    <>
      <h4 className="title-name">
        {cloneVariation?.selectedVariation
          ? cloneVariation?.selectedVariation?.name
          : cloneVariation?.product?.name}
      </h4>
      <h4 className="price">
        <NumericFormat
          value={
            cloneVariation?.selectedVariation
              ? cloneVariation?.selectedVariation?.sale_price
              : cloneVariation?.product?.sale_price
          }
          displayType={'text'}
          thousandSeparator={true}
          prefix={''}
        />
        <span>&#8363;</span>
        <del>
          <NumericFormat
            value={
              cloneVariation?.selectedVariation
                ? cloneVariation?.selectedVariation?.price
                : cloneVariation?.product?.price
            }
            displayType={'text'}
            thousandSeparator={true}
            prefix={''}
          />
          <span>&#8363;</span>
        </del>
        <Label className="modal-label mb-0">
          {cloneVariation?.selectedVariation
            ? cloneVariation?.selectedVariation?.discount
            : cloneVariation?.product?.discount}
          % {t('Off')}
        </Label>
      </h4>
      <div className="product-rating">
        <ProductBox1Rating
          totalRating={cloneVariation?.product?.rating_count}
        />
        <div className="fs-14 ms-2">
          {cloneVariation?.product?.reviews_count} {t('Reviews')}
        </div>
      </div>
      <div className="product-detail">
        <h4>{t('ProductDetails')}:</h4>
        <div className="mt-2">
          <TextLimit
            value={cloneVariation?.product?.short_description}
            maxLength={200}
            tag={'p'}
          />
        </div>
      </div>
      <div className="pickup-box">
        <div className="product-title">
          <h4>{t('ProductInformation')}</h4>
        </div>
        <div className="product-info">
          <ul className="product-info-list">
            <li>
              {t('SKU')} :{' '}
              {cloneVariation?.selectedVariation?.sku ??
                cloneVariation?.product?.sku}
            </li>
            <li>
              {t('StockStatus')} :
              {cloneVariation?.selectedVariation?.stock_status
                ? ModifyString(
                    cloneVariation?.selectedVariation?.stock_status,
                    false,
                    '_'
                  )
                : ModifyString(
                    cloneVariation?.product?.stock_status,
                    false,
                    '_'
                  )}
            </li>
            <li>
              {t('Quantity')} :{' '}
              {cloneVariation?.selectedVariation?.quantity ??
                cloneVariation?.product?.quantity}{' '}
              {t('ItemsLeft')}
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default RightVariationModal
