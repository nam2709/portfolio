import React, { useContext } from 'react';
import { useTranslation } from '@/app/i18n/client';
import I18NextContext from '@/Helper/I18NextContext';
import CartContext from '@/Helper/CartContext';
import NumberPriceTotal from '@/Components/NumberPriceTotal';

const ApplyCouponLogic = ({ values, setFieldValue }) => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, 'common');
  const { cartProducts, getTotal } = useContext(CartContext);

  const { type, amount, is_apply_all, products } = values?.coupon_detail || {};
  const matchingItems = cartProducts?.filter(item => products?.includes(item.productId));

  function calculateTotal() {
    let total = getTotal(cartProducts) + (values?.ship_detail?.total || 0);

    if (is_apply_all) {
      if (matchingItems.length > 0) {
        // No discount applied if is_apply_all is true and matching items are found
        total += 0; // Explicitly doing nothing for clarity
      } else {
        // Apply discount to all items if no specific matching items are found
        applyDiscount(total, getTotal(cartProducts));
      }
    } else {
      if (matchingItems.length > 0) {
        // Apply discount only to matching items
        applyDiscount(total, getTotal(matchingItems));
      }
    }

    return total;
  }

  function applyDiscount(total, applicableTotal) {
    if (amount) {
      if (type === "fixed") {
        total -= amount;
      } else if (type === "percentage") {
        total -= (amount * applicableTotal / 100);
      }
    }
    return total;
  }

  const totalPrice = calculateTotal();

  return (
    <NumberPriceTotal
      style="span-text-price"
      value={totalPrice}
      setFieldValue={setFieldValue}
    />
  );
}

export default ApplyCouponLogic