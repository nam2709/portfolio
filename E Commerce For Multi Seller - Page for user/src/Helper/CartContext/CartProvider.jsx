import React, { useContext, useEffect, useMemo, useState } from 'react'
import Cookies from 'js-cookie'
import CartContext from '.'
import { ToastNotification } from '@/Utils/CustomFunctions/ToastNotification'
// import { AddToCartAPI } from '@/Utils/AxiosUtils/API'
import request from '@/Utils/AxiosUtils'
import { useQuery } from '@tanstack/react-query'
import ThemeOptionContext from '../ThemeOptionsContext'
import { fetchAuthSession } from 'aws-amplify/auth'
import AccountContext from '@/Helper/AccountContext'
import { getHostApi } from '@/Utils/AxiosUtils'

const CartProvider = props => {
  //TODO: Sync with Cart database
  // const AddToCartAPI = `${getHostApi()}carts`
  const AddToCartAPI = `${process.env.NEXT_PUBLIC_API_URL}/carts`
  const { auth, signOut } = useContext(AccountContext)
  const isCookie = Cookies.get('uat')
  const [cartProducts, setCartProducts] = useState([])
  const [variationModal, setVariationModal] = useState('')
  const [cartTotal, setCartTotal] = useState(0)
  const { setCartCanvas } = useContext(ThemeOptionContext)

  console.log('cartProducts', cartProducts)
  // Getting data from Cart API
  const {
    data: CartAPIData,
    isLoading: getCartLoading,
    refetch,
  } = useQuery(['cartData'], () => request({ url: AddToCartAPI }), {
      enabled: false,
      refetchOnWindowFocus: false,
      select: res => res?.data, // Creates an array with the second and third items
  });

  const fetchCart = async () => {
    const token = await fetchAuthSession()
      .then(session => session?.tokens?.idToken?.toString())
      .catch(error => {
        console.error('GET TOKEN ERROR', error.message)
        return null
      })
    try {
      if (!token) {
        throw new Error('Authentication token is missing');
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return null;
    }
  };

  // Refetching Cart API
  useEffect(() => {
    if (isCookie) {
      // console.log('iscookie', isCookie);
      
      const fetchData = async () => {
        try {
          const result = await fetchCart();
          // console.log('Wishlist data:', result);
          setCartProducts(result);
        } catch (error) {
          console.error('Failed to fetch wishlist:', error);
        }
      };
  
      fetchData();
    }
  }, [isCookie])

  useEffect(() => {
    if (auth) {
      // console.log('auth:', auth);
      refetch();  // Assuming this function updates CartAPIData somehow
  
      // Ensure that CartAPIData is available and is an array before updating state
      if (Array.isArray(CartAPIData)) {
        setCartProducts(CartAPIData);
      } else {
        // console.error('CartAPIData is not an array:', CartAPIData);
        setCartProducts([]); // Optionally set to an empty array or handle as needed
      }
    }
  }, [auth, CartAPIData]);

  // Setting Cart data to State and LocalStorage
  useEffect(() => {
    if (isCookie) {
      // console.log('CartAPIData', CartAPIData)
      if (CartAPIData && Array.isArray(CartAPIData)) {
        setCartProducts(CartAPIData)
        setCartTotal(CartAPIData?.total)
      }
    } else {
      const isCartAvaliable = JSON.parse(localStorage.getItem('cart'))
      if (isCartAvaliable?.items?.length > 0) {
        // console.log('LOCAL CART', isCartAvaliable)
        setCartProducts(isCartAvaliable?.items)
        setCartTotal(isCartAvaliable?.total)
      }
    }
  }, [getCartLoading])

  // Adding data in localstorage when not Login
  useEffect(() => {
    storeInLocalStorage()
  }, [cartProducts])

  // Getting total
  const total = useMemo(() => {
    return cartProducts?.reduce((prev, curr) => {
      return prev + Number(curr?.price * curr?.quantity)
    }, 0)
  }, [getCartLoading, cartProducts])

  // Total Function for child components
  const getTotal = value => {
    return value?.reduce((prev, curr) => {
      return prev + Number(curr?.price * curr?.quantity)
    }, 0)
  }

  const getTotalNotSale = value => {
    return value?.reduce((prev, curr) => {
      return prev + Number(curr?.product?.price * curr?.quantity)
    }, 0)
  }

  // Remove and Delete cart data from API and State
  const removeCart = async (id, cartId) => {
    console.log({ RemoveCart: { id, cartId } })
    const updatedCartRemote = await remoteRemoveCart({ productId: id })
      // .then(res => res.json())
      .then(json => {
        console.log('iddddddddddddd', id)
        console.log({ RemovedCartRemote: json })
        console.log('cartProductssssssssssssss', cartProducts)
        const updatedCart = cartProducts?.filter(item => item.productId !== id)
        // refetch()
        console.log('UPDATED_CART', updatedCart)
        setCartProducts(updatedCart)
        //TODO: UPDATE CART
        return json
      })
    // .catch(console.error)
  }

  const remoteAddToCart = async ({ productId, quantity, vendorId, price, product, variation }) => {
    const token = await fetchAuthSession()
      .then(session => session?.tokens?.idToken?.toString())
      .catch(error => {
        console.error('GET TOKEN ERROR', error.message)
        return null
      })

    if (!token) {
      return null
    }

    const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId,
        quantity,
        vendorId,
        price,
        product,
        variation,
      }),
    }).then(res => res.json())
    return result
  }

  const remoteUpdateCart = async (productId, quantity) => {
    console.log('productId', productId);  // Corrected console log
    console.log('quantity', quantity);    // Corrected console log
  
    const token = await fetchAuthSession()
      .then(session => session?.tokens?.idToken?.toString())
      .catch(error => {
        console.error('GET TOKEN ERROR', error.message);
        return null;
      });
  
    if (!token) {
      console.error('No token available');
      return null;
    }
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating cart', error);
    }
  };
  

  const remoteRemoveCart = async ({ productId }) => {
    console.log('productIdddddddddddddddddddddddddddddddddddddddddddddddddd', productId);  // Logging the product ID

    // Fetching the authentication token
    const token = await fetchAuthSession()
      .then(session => session?.tokens?.idToken?.toString())
      .catch(error => {
        console.error('GET TOKEN ERROR', error.message);
        return null;
      });

    // If no token is obtained, log an error and return early
    if (!token) {
      console.error('No token available');
      return null;
    }

    // Attempting to delete the product from the cart
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log('Product removed successfully');
      } else {
        console.error('Failed to remove product');
      }
      console.log('responseeeeeeeeeeeeeeee', response);  // Logging the response object
      return await response.json();  // Parsing the JSON response
    } catch (error) {
      console.error('Error removing product from cart', error);
    }
  };


  // Common Handler for Increment and Decerement
  const handleIncDec = async (
    qty,
    productObj,
    isProductQty,
    setIsProductQty,
    isOpenFun,
    cloneVariation
  ) => {
    console.log({
      HandleIncDec: {
        quantity: qty,
        // productId: productObj?.id,
        product: productObj,
        // name: productObj.name,
        // slug: productObj.slug,
        // vendorId: productObj.vendorId,
      },
    })

    // const updated =

    const cartUid = null
    const updatedQty = isProductQty ? isProductQty + qty : 0 + qty
    console.log('updatedQtyyyyyy', updatedQty)
    const cart = [...cartProducts]
    console.log({ ADD_PROUDCT: productObj, TO_CART: cart })
    const index = cart.findIndex(item => item?.productId === productObj?.id)
    let tempProductId = productObj?.productId
    let tempVariantProductId = cloneVariation?.selectedVariation?.productId

    // Checking conditions for Replace Cart
    console.log('index', index)
    if (
      cart[index]?.variation &&
      cloneVariation?.variation_id &&
      tempProductId == tempVariantProductId &&
      cloneVariation?.variation_id !== cart[index]?.variation_id
    ) {
      // console.log('Replace Cart')
      return replaceCart(updatedQty, productObj, cloneVariation)
    }

    console.log('updatedQtyyyyyy1', updatedQty)

    // Add data when not presence in Cart variable: Add New Product to Cart
    if (index === -1) {
      console.log('index', index)
      const params = {
        id: productObj?.id,
        product: productObj,
        product_id: productObj?.id,
        variation: cloneVariation?.selectedVariation ? cloneVariation?.selectedVariation : null,
        variation_id: cloneVariation?.selectedVariation?.id
          ? cloneVariation?.selectedVariation?.id
          : null,
        quantity: cloneVariation?.selectedVariation?.productQty
          ? cloneVariation?.selectedVariation?.productQty
          : updatedQty,
        sub_total: cloneVariation?.selectedVariation?.sale_price
          ? updatedQty * cloneVariation?.selectedVariation?.sale_price
          : updatedQty * productObj?.sale_price,
      }
      console.log({
        New_Product_To_Cart: {
          id: productObj?.productId,

          name: productObj?.name,
          slug: productObj?.slug,
          vendorId: productObj?.vendorId,
          clone: cloneVariation,
          // product: productObj,
          // product_id: productObj?.id,
          variation: cloneVariation?.selectedVariation ? cloneVariation?.selectedVariation : null,
          variation_id: cloneVariation?.selectedVariation?.id
            ? cloneVariation?.selectedVariation?.id
            : null,
          quantity: cloneVariation?.selectedVariation?.productQty
            ? cloneVariation?.selectedVariation?.productQty
            : updatedQty,
          sub_total: cloneVariation?.selectedVariation?.sale_price
            ? updatedQty * cloneVariation?.selectedVariation?.sale_price
            : updatedQty * productObj?.sale_price,
        },
      })
      console.log('updatedQtyyyyyy2', updatedQty)
      // const updatedCart = await addToCart({
      //   productId: productObj?.id,
      //   vendorId: productObj?.vendorId,
      //   quantity: qty,
      //   product: productObj,
      //   variation: cloneVariation?.selectedVariation ? cloneVariation?.selectedVariation : null,
      //   price: productObj?.sale_price || productObj?.price,
      // })
      //   .then(console.log)
      //   .catch(console.error)
      // console.dir({ env: process.env })
      console.log('paramsssssssssssssssss', params)
      const updatedCart = await remoteAddToCart({
        productId: productObj?.productId,
        vendorId: productObj?.vendorId,
        quantity: qty,
        product: productObj,
        variation: cloneVariation?.selectedVariation ? cloneVariation?.selectedVariation : null,
        price: productObj?.sale_price || productObj?.price,
      })
      console.log('json', updatedCart);

      const result = await fetchCart();
      // console.log('Wishlist data:', result);
      setCartProducts(result);
    
      // return updatedCart;
    } else {
      console.log('updatedQtyyyyyy3', updatedQty)
      // Checking the Stock QTY of paricular product
      const productStockQty = cart[index]?.variation?.quantity
        ? cart[index]?.variation?.quantity
        : cart[index]?.product?.quantity
      if (productStockQty < cart[index]?.quantity + qty) {
        ToastNotification(
          'error',
          `You can not add more items than available. In stock ${productStockQty} items.`
        )
        return false
      }
      console.log('updatedQtyyyyyy4', updatedQty)
      if (cart[index]?.variation) {
        cart[index].variation.selected_variation = cart[index]?.variation?.attribute_values
          ?.map(values => values.value)
          .join('/')
      }
      console.log('qty', qty)
      const newQuantity = updatedQty
      console.log('updatedQtyyyyyy5', updatedQty)
      const params = {
        quantity: updatedQty
      };
      if (newQuantity < 1) {
        // Remove the item from the cart if the new quantity is less than 1
        return removeCart(productObj?.productId, cartUid ? cartUid : cart[index].id)
        refetch();
      } else {
        console.log('newQuantity', newQuantity)
        console.log('productObj?.productId', productObj?.productId)
        const result = await remoteUpdateCart(productObj?.productId, newQuantity)
        refetch();

        const updatedCart = cart?.map((item, idx) => {
          if (idx === index) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });

        setCartProducts(updatedCart);
        
        console.log('result', result)
        // cart[index] = {
        //   ...cart[index],
        //   id: cartUid?.id ? cartUid?.id : cart[index].id ? cart[index].id : null,
        //   quantity: newQuantity,
        //   sub_total:
        //     newQuantity *
        //     (cart[index]?.variation
        //       ? cart[index]?.variation?.sale_price
        //       : cart[index]?.product?.sale_price),
        // }
        // console.log({ Updated_Product_To_Cart: cart })
        // // const updatedCart = await remoteUpdateCart({})
        // isCookie ? setCartProducts([...cart]) : setCartProducts([...cart])
      }
    }
    console.log('updatedQtyyyyyy6', updatedQty)
    // Update the productQty state immediately after updating the cartProducts state
    if (isCookie) {
      setIsProductQty && setIsProductQty(updatedQty)
      isOpenFun && isOpenFun(false)
    } else {
      setIsProductQty && setIsProductQty(updatedQty)
      isOpenFun && isOpenFun(false)
    }
    console.log('updatedQtyyyyyy7', updatedQty)
    setCartCanvas(true)
    console.log('updatedQtyyyyyy8', updatedQty)
    console.log('cartProductssssssssssssssssssssssssssssssssssssssssssss', cartProducts)
  }

  // Replace Cart
  const replaceCart = (updatedQty, productObj, cloneVariation) => {
    console.log({
      ReplaceCart: {
        updatedQuantity: updatedQty,
        product: {
          id: productObj.id,
          name: productObj.name,
          slug: productObj.slug,
          vendorId: productObj.vendorId,
        },
        clone: cloneVariation,
      },
    })
    // const cart = [...cartProducts]
    // const index = cart.findIndex(item => item.product_id === productObj?.id)
    // cart[index].quantity = 0

    // const productQty = cart[index]?.variation
    //   ? cart[index]?.variation?.quantity
    //   : cart[index]?.product?.quantity

    // if (cart[index]?.variation) {
    //   cart[index].variation.selected_variation = cart[index]?.variation?.attribute_values
    //     ?.map(values => values.value)
    //     .join('/')
    // }

    // // Checking the Stock QTY of paricular product
    // if (productQty < cart[index]?.quantity + updatedQty) {
    //   ToastNotification(
    //     'error',
    //     `You can not add more items than available. In stock ${productQty} items.`
    //   )
    //   return false
    // }

    // const params = {
    //   id: null,
    //   product: productObj,
    //   product_id: productObj?.id,
    //   variation: cloneVariation?.selectedVariation ? cloneVariation?.selectedVariation : null,
    //   variation_id: cloneVariation?.selectedVariation?.id
    //     ? cloneVariation?.selectedVariation?.id
    //     : null,
    //   quantity: cloneVariation?.productQty ? cloneVariation?.productQty : updatedQty,
    //   sub_total: cloneVariation?.selectedVariation?.sale_price
    //     ? updatedQty * cloneVariation?.selectedVariation?.sale_price
    //     : updatedQty * productObj?.sale_price,
    // }

    // isCookie
    //   ? setCartProducts(prevCartProducts =>
    //       prevCartProducts.map(elem => {
    //         if (elem?.product_id === cloneVariation?.selectedVariation?.product_id) {
    //           return params
    //         } else {
    //           return elem
    //         }
    //       })
    //     )
    //   : setCartProducts(prevCartProducts =>
    //       prevCartProducts.map(elem => {
    //         if (elem?.product_id === cloneVariation?.selectedVariation?.product_id) {
    //           return params
    //         } else {
    //           return elem
    //         }
    //       })
    //     )
  }

  // Setting data to localstroage when UAT is not there
  const storeInLocalStorage = () => {
    setCartTotal(total)
    localStorage.setItem('cart', JSON.stringify({ items: cartProducts, total: total }))
  }

  return (
    <CartContext.Provider
      value={{
        ...props,
        cartProducts,
        setCartProducts,
        cartTotal,
        setCartTotal,
        removeCart,
        getTotal,
        getTotalNotSale,
        handleIncDec,
        variationModal,
        setVariationModal,
        replaceCart,
      }}
    >
      {props.children}
    </CartContext.Provider>
  )
}

export default CartProvider
