import React, { useContext } from 'react'
import { CardBody } from 'reactstrap'
import SettingContext from '../../../Helper/SettingContext'
import Image from 'next/image'
import CartContext from '@/Helper/CartContext'
import { placeHolderImage } from '../../../../Data/CommonPath'
import { useTranslation } from '@/app/i18n/client'
import I18NextContext from '@/Helper/I18NextContext'
import { NumericFormat } from 'react-number-format'
import NumberPrice from '@/Components/NumberPrice'

const SidebarProduct = ({ values }) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const { cartProducts } = useContext(CartContext)
  const { convertCurrency } = useContext(SettingContext)
  return (
    <CardBody>
      <div className="title-header">
        <h5 className="fw-bold">{t('Checkout')}</h5>
      </div>
      <div className="product-details">
        <>
          <ul className="cart-listing">
            {cartProducts?.map((item, i) => (
              <li key={i}>
                <Image
                  src={
                    item?.product?.product_meta_image?.original_url ??
                    item?.product?.product_meta_image?.url ??
                    item?.product?.url 
                  }
                  className="img-fluid"
                  alt={item?.name || 'product'}
                  width={70}
                  height={70}
                />
                <div className="cart-content">
                  <h4>
                    {item?.variation ? item?.variation?.name : item?.product?.name ?? item?.name}
                  </h4>
                  <h5 className="text-theme">
                    <NumberPrice
                      style="span-text-price"
                      value={
                        item?.variation
                          ? item?.variation.sale_price
                          : item?.product?.sale_price ?? item?.sale_price
                      }
                    />{' '}
                    x {item.quantity}
                  </h5>
                  {/* <h5 className="price">
                    <NumberPrice
                      style="span-text-price"
                      value={
                        item?.variation
                          ? item?.variation.sale_price
                          : item?.sale_price * item.quantity
                      }
                    />
                  </h5> */}
                </div>
              </li>
            ))}
          </ul>
        </>
      </div>
    </CardBody>
  )
}

export default SidebarProduct
