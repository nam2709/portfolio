import React, { useContext, useState, useEffect } from 'react'
import { useTranslation } from '@/app/i18n/client'
import I18NextContext from '@/Helper/I18NextContext'
import CartContext from '@/Helper/CartContext'
import _ from 'lodash'

const AppliedCouponDetails = ({ values, cartProducts }) => {
    console.log('cartProducts', cartProducts)
    const { getTotal } = useContext(CartContext)
    const { i18Lang } = useContext(I18NextContext)
    const { t } = useTranslation(i18Lang, 'common')
    const { type, amount, is_apply_all, products, exclude_products, min_spend } = values?.coupon_detail || {};

    const matchingItems = is_apply_all
    ? cartProducts?.filter(item => !exclude_products?.includes(item?.productId))
    : cartProducts?.filter(item => products?.includes(item?.productId));
    const productNames = matchingItems?.map(item => item.product.name).join(', ');
    // Determine the coupon value text based on the type.
    let couponValue;
    switch (type) {
        case 'fixed':
            couponValue = `${amount}`;
            break;
        case 'percentage':
            couponValue = `${amount}%`; // Ensure the percentage sign is displayed for percentage type.
            break;
        case 'free_shipping':
            couponValue = t('FREESHIPPING'); // Translated text for free shipping.
            break;
        default:
            return null; // Render nothing if the type is not recognized.
    }

    // The common JSX structure for displaying the coupon information.
    return (
        <h4>
            {is_apply_all ? (
                matchingItems.length > 0 && getTotal(matchingItems) >= min_spend ? (
                    <>{t('Yousaved')} <span>{couponValue}</span> {t('withthiscode')} 🎉</>
                ) : (
                    <>{t('NoAvailability')}</>
                )
            ) : (
                // For coupons that apply to specific products
                matchingItems.length > 0 && getTotal(matchingItems) >= min_spend ? (
                    <>{t('Yousaved')} <span>{couponValue} on {productNames}</span> {t('withthiscode')} 🎉</>
                ) : (
                    <>{t('NoAvailability')}</>
                )
            )}
            <p>{t('CouponApplied')}</p>
        </h4>
    );
}

export default AppliedCouponDetails