import React, { useContext, useEffect, useState } from 'react';
import { Input, InputGroup } from 'reactstrap';
import Btn from '@/Elements/Buttons/Btn';
import { RiAddLine, RiSubtractLine } from 'react-icons/ri';
import CartContext from '@/Helper/CartContext';

const HandleQuantity = ({ classes = {}, productObj, elem, customIcon }) => {
  const { cartProducts, handleIncDec } = useContext(CartContext);
  const [productQty, setProductQty] = useState({}); // Initialize as an object

  useEffect(() => {
    // console.log('cartProducts', cartProducts)
    // Find product based on productId from elem and update local state
    const foundProduct = cartProducts?.find(el => el.productId === elem?.productId);
    // console.log('foundProduct', foundProduct)
    if (foundProduct) {
      setProductQty(prevQty => ({
        ...prevQty,
        [foundProduct.productId]: foundProduct.quantity
      })); // Update state by setting the id as key and quantity as value
      // console.log('productQty', foundProduct.productId, foundProduct.quantity);
    } else {
      setProductQty(prevQty => ({
        ...prevQty,
        [elem?.productId]: 0 // Set to 0 if no product is found
      }));
    }
  }, [cartProducts, elem?.productId]);

  return (
    <li className={classes?.customClass ? classes.customClass : ''}>
      <div className="cart_qty">
        <InputGroup>
          <Btn
            type="button"
            className="btn qty-left-minus"
            onClick={() => handleIncDec(-1, productObj, productQty[elem?.productId], qty => setProductQty({
              [elem?.productId]: qty
            }), false, elem?.productId)}
          >
            {customIcon && productQty[elem?.productId] <= 1 ? customIcon : <RiSubtractLine />}
          </Btn>
          <Input
            className="input-number qty-input"
            type="text"
            name="quantity"
            value={productQty[elem?.productId]}
            readOnly
          />
          <Btn
            type="button"
            className="btn qty-right-plus"
            onClick={() => handleIncDec(1, productObj, productQty[elem?.productId], qty => setProductQty({
              ...productQty,
              [elem?.productId]: qty
            }), false, elem?.productId)}
          >
            <RiAddLine />
          </Btn>
        </InputGroup>
      </div>
    </li>
  );
}

export default HandleQuantity;
