import React, { useContext, useEffect, useState } from 'react'
import { Card, Col } from 'reactstrap'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

import SettingContext from '../../../Helper/SettingContext'
import { useTranslation } from '@/app/i18n/client'
import SidebarProduct from './SidebarProduct'
import CartContext from '@/Helper/CartContext'
import PointWallet from './PointWallet'
import I18NextContext from '@/Helper/I18NextContext'
import ApplyCoupon from './ApplyCoupon'
import ApplyCouponLogic from './ApplyCouponLogic'
import PlaceOrder from './PlaceOrder'
import NumberPrice from '@/Components/NumberPrice'
import NumberPriceTotal from '@/Components/NumberPriceTotal'
import { fetchAuthSession } from 'aws-amplify/auth'
import { getHostApi } from '@/Utils/AxiosUtils'
import { ToastNotification } from '../../../Utils/CustomFunctions/ToastNotification'
import crypto from 'crypto'
import _ from 'lodash'
import { isZaloPayAvailable } from './isZaloPayAvailable.action';
import { apiPaymentAvailable } from './apiPaymentAvailable.action';
import { apiConsumerCheckout } from './apiConsumerCheckout.action';
import { apiCreateZaloPay } from './apiCreateZaloPay.action';
import { apiGetPrice } from './apiGetPrice.action';
import { apiGetVendor } from './apiGetVendor.action';

// import CryptoJS from 'crypto-js'

// import { checkout } from '@/app/actions/carts'

const CheckoutSidebar = ({ values, setFieldValue, addressData }) => {
  const router = useRouter()
  // It Just Static Values as per cart default value (When you are using api then you need calculate as per your requirement)
  const [checkoutData, setCheckoutData] = useState({
    total: {
      convert_point_amount: -10,
      convert_wallet_balance: -84.4,
      coupon_total_discount: 10,
      points: 300,
      points_amount: 10000,
      shipping_total: 30000,
      sub_total: 35.19,
      tax_total: 2.54,
      total: 37.73,
      wallet_balance: 84000,
    },
  })
  const [allowCheckout, setAllowCheckout] = useState(true)
  const { convertCurrency } = useContext(SettingContext)
  const [storeCoupon, setStoreCoupon] = useState([])
  //dữ liệu mook từ giỏ hàng
  const { cartProducts, getTotal, setCartProducts } = useContext(CartContext)
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  /////
  const { type, amount, is_apply_all, products, exclude_products, min_spend } = values?.coupon_detail || {};
  const matchingItems = is_apply_all
  ? cartProducts?.filter(item => !exclude_products?.includes(item?.productId))
  : cartProducts?.filter(item => products?.includes(item?.productId));

  console.log('cartProducts', cartProducts)
  console.log('matchingItems', matchingItems)
  // Submitting data on Checkout
  useEffect(() => {
    if (
      values['billing_address_id'] &&
      values['shipping_address_id'] &&
      values['delivery_description'] &&
      values['payment_method']
    ) {
      values['variation_id'] = ''
      delete values['total']
      values['products'] = cartProducts
      values['return_url'] = `${process.env.PAYMENT_RETURN_URL}${i18Lang}/account/order`
      values['cancel_url'] = process.env.PAYMENT_CANCEL_URL
    }
  }, [])

  const checkDataAvailability = async (orderId) => {
    return await apiPaymentAvailable(orderId)
  }
  
  const handleCheckout = async () => {
    if(values.shipping_address !== "" ){
      try {
        const response = await apiConsumerCheckout(values)
        
        if (response.ok) {
          const responseData = await response.json()
          if (isZaloPayAvailable()) {
          const data = await checkDataAvailability(responseData.order[0])
          const paymentData = {...data, ...values}
          //TODO: create Zalo Payment get order_url console.log('paymentData', paymentData)
          if (values?.payment_method !== 'COD') {
            const data = await handleCheckoutZaloPay(paymentData);
            const order_url = data?.order_url;
            const orderIndex = order_url?.indexOf('order=') + 6;
    
            if (orderIndex > 5) {
                const order_payment = order_url.substring(orderIndex);
                const baseUrls = {
                  'TRANSFER_PAYMENTS': 'https://qcgateway.zalopay.vn/pay/v2/qr',
                  'CARD_PAYMENTS': 'https://qcgateway.zalopay.vn/pay/v2/atm-one-form',
                  'CREDIT_PAYMENTS': 'https://qcgateway.zalopay.vn/pay/v2/cc'
                };
    
                const url = baseUrls[values?.payment_method];
                if (url) {
                    window.open(`${url}?order=${order_payment}`, '_blank');
                }
            }
          }
          }
          setCartProducts([]);
          router.push(`/${i18Lang}/account/order`)
        } else {
          console.error('Failed to fetch:', response.status, response.statusText)
        }
      } catch (error) {
        console.error('Error while checkout:', error.message)
      }
    }
    else {
      ToastNotification('warn', t('SelectAdress'))
    }

    
  }

  const handleCheckoutZaloPay = async (payment) => {
    try {
      const response = await apiCreateZaloPay(payment)

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
  }

  const handleGetPrice = async () => {
    setAllowCheckout(false)

    let cart = {}
    const totals = cartProducts.reduce((acc, item) => {
        acc.money_collection += item.price*item.quantity;
        acc.total_product_price += item.price*item.quantity;
        acc.total_product_weight += (item?.products?.weight*item.quantity || 2000);
        return acc;
    }, { money_collection: 0, total_product_price: 0, total_product_weight: 0 });
    
    cart.money_collection = totals.money_collection;
    cart.total_product_price = totals.total_product_price;
    cart.total_product_weight = totals.total_product_weight;
    cart.shop = await handleCartProcessing(cartProducts)

    console.log('all checkout', {...values, cart_items: cart})
    if (!isZaloPayAvailable()) {
      setAllowCheckout(true);
      return;
    }

    try {
      const response = await apiGetPrice(values, cart)

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('data price', data)
      setFieldValue('ship_detail', data)
      setAllowCheckout(true)
      return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
  }

  const handleCartProcessing = async (cartProducts) => {
    // Group the cart products by vendorId
    const groupedProducts = _.groupBy(cartProducts, 'vendorId');

    // Map over the keys of the groupedProducts to fetch vendor details
    const fetchPromises = Object.entries(groupedProducts).map(async ([vendorId, products]) => {
        try {
            // Fetch vendor details
            const response = await apiGetVendor(vendorId);
            const vendorData = await response.json();

            // Add the store/vendor data to each group
            return {
                vendorId,
                store: vendorData,
                products
            };
        } catch (error) {
            console.error('Failed to fetch vendor data for vendorId:', vendorId, error);
            return {
                vendorId,
                store: null, // Handle error scenarios, e.g., by setting store to null
                products
            };
        }
    });

    // Wait for all fetch operations to complete
    const enrichedCartProducts = await Promise.all(fetchPromises);

    return enrichedCartProducts;
  };

  useEffect(() => {
    handleGetPrice()
  }, [cartProducts, values?.shipping_address]);

  console.log('values', values)

  return (
    <Col xxl="4" xl="5">
      <Card className="pos-detail-card">
        <SidebarProduct values={values} setFieldValue={setFieldValue} />
        <div className="pos-loader">
          <ul className={`summary-total position-relative`}>
            <li>
              <h4>{t('Subtotal')}</h4>
              <h4 className="price">
                <NumberPrice style="span-text-price" value={getTotal(cartProducts)} />
              </h4>
            </li>
            <li>
              <h4>{t('Shipping')}</h4>
              <h4 className="price">
                <NumberPrice style="span-text-price" value={values?.ship_detail?.total} />
              </h4>
            </li>

            <PointWallet
              values={values}
              setFieldValue={setFieldValue}
              checkoutData={checkoutData}
            />

            <ApplyCoupon
              values={values}
              setFieldValue={setFieldValue}
              setStoreCoupon={setStoreCoupon}
              storeCoupon={storeCoupon}
              cartProducts={cartProducts}
            />

            <li className="list-total">
              <h4>{t('Tổng thanh toán')}</h4>
              <h4 className="price">
                {/* <ApplyCouponLogic 
                  values={values}
                  setFieldValue={setFieldValue}
                /> */}
                {
                  is_apply_all ? (
                    matchingItems?.length > 0 && getTotal(matchingItems) >= min_spend ? 
                    (
                      values?.coupon_detail?.amount ? (
                        values?.coupon_detail?.type === "fixed" ? (
                          <NumberPriceTotal
                            style="span-text-price"
                            value={getTotal(cartProducts) + values?.ship_detail?.total - (values.coupon_detail.amount <= getTotal(matchingItems) ? values.coupon_detail.amount : getTotal(matchingItems))}
                            setFieldValue={setFieldValue}
                          />
                        ) : (
                          values?.coupon_detail?.type === "percentage" && (
                            <NumberPriceTotal
                              style="span-text-price"
                              value={getTotal(cartProducts) + values?.ship_detail?.total - (values.coupon_detail.amount * getTotal(matchingItems) / 100)}
                              setFieldValue={setFieldValue}
                            />
                          )
                        )
                      ) : (
                        <NumberPriceTotal
                          style="span-text-price"
                          value={getTotal(cartProducts) + values?.ship_detail?.total}
                          setFieldValue={setFieldValue}
                        />
                      )
                    ) : (
                      <NumberPriceTotal
                        style="span-text-price"
                        value={getTotal(cartProducts) + values?.ship_detail?.total}
                        setFieldValue={setFieldValue}
                      />
                    )
                  ) : (
                    matchingItems?.length > 0 && getTotal(matchingItems) >= min_spend ? 
                    (
                      values?.coupon_detail?.amount ? (
                        values?.coupon_detail?.type === "fixed" ? (
                          <NumberPriceTotal
                            style="span-text-price"
                            value={getTotal(cartProducts) + values?.ship_detail?.total - (values.coupon_detail.amount <= getTotal(matchingItems) ? values.coupon_detail.amount : getTotal(matchingItems))}
                            setFieldValue={setFieldValue}
                          />
                        ) : (
                          values?.coupon_detail?.type === "percentage" && (
                            <NumberPriceTotal
                              style="span-text-price"
                              value={getTotal(cartProducts) + values?.ship_detail?.total - (values.coupon_detail.amount * getTotal(matchingItems) / 100)}
                              setFieldValue={setFieldValue}
                            />
                          )
                        )
                      ) : (
                        <NumberPriceTotal
                          style="span-text-price"
                          value={getTotal(cartProducts) + values?.ship_detail?.total}
                          setFieldValue={setFieldValue}
                        />
                      )
                    ) : (
                      <NumberPriceTotal
                        style="span-text-price"
                        value={getTotal(cartProducts) + values?.ship_detail?.total}
                        setFieldValue={setFieldValue}
                      />
                    )
                  )
                }
              </h4>
            </li>
          </ul>
        </div>
        <PlaceOrder values={values} onClick={handleCheckout} isOpen={allowCheckout}/>
      </Card>
    </Col>
  )
}

export default CheckoutSidebar
