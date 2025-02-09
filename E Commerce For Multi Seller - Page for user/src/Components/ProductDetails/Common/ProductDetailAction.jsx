import React, { useContext, useEffect, useState } from 'react'
import { Input, InputGroup } from 'reactstrap'
import Btn from '@/Elements/Buttons/Btn'
import CartContext from '@/Helper/CartContext'
import I18NextContext from '@/Helper/I18NextContext'
import { RiAddLine, RiSubtractLine } from 'react-icons/ri'
import { useRouter } from 'next/navigation'
import AddToWishlist from '@/Components/Common/ProductBox/AddToWishlist'
import AddToCompare from '@/Components/Common/ProductBox/AddToCompare'
import AddToCartButton from './AddToCartButton'
import { usePathname, useSearchParams } from 'next/navigation'
import AccountContext from '@/Helper/AccountContext'

const ProductDetailAction = ({ productState, setProductState, extraOption }) => {
  const pathname = usePathname()
  const search = useSearchParams()
  const searchparam = search.toString()
  const currentPath = pathname + (searchparam ? `?${searchparam}` : '');

  const { login, auth } = useContext(AccountContext)
  // console.log('auth', auth)
  const { i18Lang } = useContext(I18NextContext)
  const { cartProducts, handleIncDec } = useContext(CartContext)
  const [isProductQty, setIsProductQty] = useState(0);
  const [foundObject, setFoundObject] = useState(null);
  const router = useRouter()
  useEffect(() => {
    const findObjectByProductId = (cartProducts, productId) => {
      return cartProducts?.find(object => object.productId === productId);
    };

    const result = findObjectByProductId(cartProducts, productState?.product.productId);
    setFoundObject(result);
  }, [productState?.product.productId, cartProducts]);
  const addToCart = () => {
    console.log('currentPath', currentPath)
    if (!auth?.userId) {
      const loginPath = `/vi/auth/login?redirect=${currentPath}`
      router.push(loginPath);
      return loginPath
    }
    
    console.dir('ProductDetail.AddToCart', {
      // ACTION: 'AddToCart',
      product: productState?.product,
      quantity: productState?.productQty,
      state: productState,
    })
    handleIncDec(1, productState?.product, foundObject?.quantity, false, false, productState)
  }
  const buyNow = async () => {
    if (!auth?.userId) {
      const loginPath = `/vi/auth/login?redirect=${currentPath}`
      router.push(loginPath);
      return loginPath
    }
    if (cartProducts.length === 0){
      await handleIncDec(1, productState?.product, foundObject?.quantity, false, false, productState)
    }
    await handleIncDec(foundObject?.quantity, productState?.product, false, false, false, productState)
    router.push(`/${i18Lang}/checkout`)
  }
  const updateQty = qty => {
    if (1 > productState?.productQty + qty) return
    setProductState(prev => {
      return { ...prev, productQty: productState?.productQty + qty }
    })
    checkStockAvailable()
  }
  const checkStockAvailable = () => {
    if (productState?.selectedVariation) {
      setProductState(prevState => {
        const tempSelectedVariation = { ...prevState.selectedVariation }
        tempSelectedVariation.stock_status =
          tempSelectedVariation.quantity < prevState.productQty ? 'out_of_stock' : prevState?.selectedVariation?.stock_status
        return {
          ...prevState,
          selectedVariation: tempSelectedVariation,
        }
      })
    } else {
      setProductState(prevState => {
        const tempProduct = { ...prevState.product }
        tempProduct.stock_status =
          tempProduct.quantity < prevState.productQty ? 'out_of_stock' : prevState?.product?.stock_status
        return {
          ...prevState,
          product: tempProduct,
        }
      })
    }
  }
  return (
    <>
      <div className="note-box">
        <div className="cart_qty qty-box product-qty">
          <InputGroup>
            <Btn type="button" className="qty-right-plus" onClick={() => {
              if (!auth?.userId) {
                const loginPath = `/vi/auth/login?redirect=${currentPath}`
                router.push(loginPath);
                return loginPath
              }
              handleIncDec(-1, productState?.product, foundObject?.quantity, false, false, productState)}}>
              <RiSubtractLine />
            </Btn>
            <Input
              className="input-number qty-input"
              type="number"
              value={foundObject?.quantity || 0}
              readOnly
            />
            <Btn type="button" className="qty-left-minus" onClick={() => {
              if (!auth?.userId) {
                const loginPath = `/vi/auth/login?redirect=${currentPath}`
                router.push(loginPath);
                return loginPath
              }
              handleIncDec(1, productState?.product, foundObject?.quantity, false, false, productState)}}>
              <RiAddLine />
            </Btn>
          </InputGroup>
        </div>
        {extraOption !== false ? (
          <div className="wishlist-btn-group">
            <AddToWishlist productObj={productState?.product} customClass={'wishlist-button btn'} />
            {/* <AddToCompare productObj={productState?.product} customClass={'wishlist-button btn'} /> */}
          </div>
        ) : null}
      </div>
      <AddToCartButton
        productState={productState}
        addToCart={addToCart}
        buyNow={buyNow}
        extraOption={extraOption}
      />
    </>
  )
}

export default ProductDetailAction
