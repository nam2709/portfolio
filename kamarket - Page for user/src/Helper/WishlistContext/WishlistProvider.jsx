import React, { useContext, useEffect, useMemo, useState } from 'react'
import Cookies from 'js-cookie'
import WishlistContext from '.'
import { ToastNotification } from '@/Utils/CustomFunctions/ToastNotification'
import request from '@/Utils/AxiosUtils'
import { useQuery } from '@tanstack/react-query'
import ThemeOptionContext from '../ThemeOptionsContext'
import { fetchAuthSession } from 'aws-amplify/auth'
import AccountContext from '@/Helper/AccountContext'
import { getHostApi } from '@/Utils/AxiosUtils'

const WishlistProvider = props => {
  const AddToWishlistAPI = `${process.env.NEXT_PUBLIC_API_URL}/wishlist`
  const { auth, signOut } = useContext(AccountContext)
  const isCookie = Cookies.get('uat') 
  const [WishlistProducts, setWishlistProducts] = useState([])
  const [clickUpdate, setClickUpdate] = useState(true)
  // const [WishlistTotal, setWishlistTotal] = useState(0)
  // const { setWishlistCanvas } = useContext(ThemeOptionContext)

  // Getting data from Wishlist API
  const {
    data: WishlistAPIData,
    isLoading: getWishlistLoading,
    refetch,
  } = useQuery(['WishlistData'], () => request({ url: AddToWishlistAPI }), {
      enabled: false,
      refetchOnWindowFocus: false,
      select: res => res?.data, // Creates an array with the second and third items
  });

  const fetchWishlist = async () => {
    try {
      if (!isCookie) {
        throw new Error('Authentication token is missing');
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${isCookie}`
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

  // Refetching Wishlist API
  useEffect(() => {
    if (isCookie) {
      // console.log('iscookie', isCookie);
      
      const fetchData = async () => {
        try {
          const result = await fetchWishlist();
          // console.log('Wishlist data:', result);
          setWishlistProducts(result);
        } catch (error) {
          console.error('Failed to fetch wishlist:', error);
        }
      };
  
      fetchData();
    }
  }, [isCookie, clickUpdate]);  

  useEffect(() => {
    if (auth) {
      // console.log('auth', auth)
      refetch()
      setWishlistProducts(WishlistAPIData)
    }
  }, [auth])

  // Setting Wishlist data to State and LocalStorage
  useEffect(() => {
    if (isCookie) {
      // console.log('WishlistAPIData', WishlistAPIData)
      if (WishlistAPIData) {
        console.log('USER WishlistTTTTTTTTTTTTTTTTTTTTT', WishlistAPIData)
        setWishlistProducts(WishlistAPIData)
      }
    } else {
      const isWishlistAvaliable = JSON.parse(localStorage.getItem('Wishlist'))
      if (isWishlistAvaliable?.items?.length > 0) {
        console.log('LOCAL Wishlist', isWishlistAvaliable)
        setWishlistProducts(isWishlistAvaliable?.items)
      }
    }
  }, [getWishlistLoading])

  // Adding data in localstorage when not Login
  // useEffect(() => {
  //   storeInLocalStorage()
  // }, [WishlistProducts])

  // Remove and Delete Wishlist data from API and State
  // const removeWishlist = async (id, WishlistId) => {
  //   console.log({ RemoveWishlist: { id, WishlistId } })
  //   const updatedWishlistRemote = await remoteRemoveWishlist({ productId: id })
  //     // .then(res => res.json())
  //     .then(json => {
  //       console.log('iddddddddddddd', id)
  //       console.log({ RemovedWishlistRemote: json })
  //       console.log('WishlistProductssssssssssssss', WishlistProducts)
  //       const updatedWishlist = WishlistProducts?.filter(item => item.productId !== id)
  //       // refetch()
  //       console.log('UPDATED_Wishlist', updatedWishlist)
  //       setWishlistProducts(updatedWishlist)
  //       //TODO: UPDATE Wishlist
  //       return json
  //     })
  //   // .catch(console.error)
  // }

  // const remoteAddToWishlist = async ({ productId, quantity, vendorId, price, product, variation }) => {
  //   const token = await fetchAuthSession()
  //     .then(session => session?.tokens?.idToken?.toString())
  //     .catch(error => {
  //       console.error('GET TOKEN ERROR', error.message)
  //       return null
  //     })

  //   if (!token) {
  //     return null
  //   }

  //   const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Wishlists`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: JSON.stringify({
  //       productId,
  //       quantity,
  //       vendorId,
  //       price,
  //       product,
  //       variation,
  //     }),
  //   }).then(res => res.json())
  //   return result
  // }

  // const remoteUpdateWishlist = async (productId, quantity) => {
  //   console.log('productId', productId);  // Corrected console log
  //   console.log('quantity', quantity);    // Corrected console log
  
  //   const token = await fetchAuthSession()
  //     .then(session => session?.tokens?.idToken?.toString())
  //     .catch(error => {
  //       console.error('GET TOKEN ERROR', error.message);
  //       return null;
  //     });
  
  //   if (!token) {
  //     console.error('No token available');
  //     return null;
  //   }
  
  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Wishlists/`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         productId,
  //         quantity,
  //       }),
  //     });
  //     return await response.json();
  //   } catch (error) {
  //     console.error('Error updating Wishlist', error);
  //   }
  // };

  // const remoteRemoveWishlist = async ({ productId }) => {
  //   console.log('productIdddddddddddddddddddddddddddddddddddddddddddddddddd', productId);  // Logging the product ID

  //   // Fetching the authentication token
  //   const token = await fetchAuthSession()
  //     .then(session => session?.tokens?.idToken?.toString())
  //     .catch(error => {
  //       console.error('GET TOKEN ERROR', error.message);
  //       return null;
  //     });

  //   // If no token is obtained, log an error and return early
  //   if (!token) {
  //     console.error('No token available');
  //     return null;
  //   }

  //   // Attempting to delete the product from the Wishlist
  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Wishlists/${productId}`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (response.ok) {
  //       console.log('Product removed successfully');
  //     } else {
  //       console.error('Failed to remove product');
  //     }
  //     console.log('responseeeeeeeeeeeeeeee', response);  // Logging the response object
  //     return await response.json();  // Parsing the JSON response
  //   } catch (error) {
  //     console.error('Error removing product from Wishlist', error);
  //   }
  // };

  // // Common Handler for Increment and Decerement
  // const handleIncDec = async (
  //   qty,
  //   productObj,
  //   isProductQty,
  //   setIsProductQty,
  //   isOpenFun,
  //   cloneVariation
  // ) => {
  //   console.log({
  //     HandleIncDec: {
  //       quantity: qty,
  //       // productId: productObj?.id,
  //       product: productObj,
  //       // name: productObj.name,
  //       // slug: productObj.slug,
  //       // vendorId: productObj.vendorId,
  //     },
  //   })

  //   // const updated =

  //   const WishlistUid = null
  //   const updatedQty = isProductQty ? isProductQty + qty : 0 + qty
  //   console.log('updatedQtyyyyyy', updatedQty)
  //   const Wishlist = [...WishlistProducts]
  //   console.log({ ADD_PROUDCT: productObj, TO_Wishlist: Wishlist })
  //   const index = Wishlist.findIndex(item => item?.productId === productObj?.id)
  //   let tempProductId = productObj?.productId
  //   let tempVariantProductId = cloneVariation?.selectedVariation?.productId

  //   // Checking conditions for Replace Wishlist
  //   console.log('index', index)
  //   if (
  //     Wishlist[index]?.variation &&
  //     cloneVariation?.variation_id &&
  //     tempProductId == tempVariantProductId &&
  //     cloneVariation?.variation_id !== Wishlist[index]?.variation_id
  //   ) {
  //     // console.log('Replace Wishlist')
  //     return replaceWishlist(updatedQty, productObj, cloneVariation)
  //   }

  //   console.log('updatedQtyyyyyy1', updatedQty)

  //   // Add data when not presence in Wishlist variable: Add New Product to Wishlist
  //   if (index === -1) {
  //     console.log('index', index)
  //     const params = {
  //       id: productObj?.id,
  //       product: productObj,
  //       product_id: productObj?.id,
  //       variation: cloneVariation?.selectedVariation ? cloneVariation?.selectedVariation : null,
  //       variation_id: cloneVariation?.selectedVariation?.id
  //         ? cloneVariation?.selectedVariation?.id
  //         : null,
  //       quantity: cloneVariation?.selectedVariation?.productQty
  //         ? cloneVariation?.selectedVariation?.productQty
  //         : updatedQty,
  //       sub_total: cloneVariation?.selectedVariation?.sale_price
  //         ? updatedQty * cloneVariation?.selectedVariation?.sale_price
  //         : updatedQty * productObj?.sale_price,
  //     }
  //     console.log({
  //       New_Product_To_Wishlist: {
  //         id: productObj?.productId,

  //         name: productObj?.name,
  //         slug: productObj?.slug,
  //         vendorId: productObj?.vendorId,
  //         clone: cloneVariation,
  //         // product: productObj,
  //         // product_id: productObj?.id,
  //         variation: cloneVariation?.selectedVariation ? cloneVariation?.selectedVariation : null,
  //         variation_id: cloneVariation?.selectedVariation?.id
  //           ? cloneVariation?.selectedVariation?.id
  //           : null,
  //         quantity: cloneVariation?.selectedVariation?.productQty
  //           ? cloneVariation?.selectedVariation?.productQty
  //           : updatedQty,
  //         sub_total: cloneVariation?.selectedVariation?.sale_price
  //           ? updatedQty * cloneVariation?.selectedVariation?.sale_price
  //           : updatedQty * productObj?.sale_price,
  //       },
  //     })
  //     console.log('updatedQtyyyyyy2', updatedQty)
  //     // const updatedWishlist = await addToWishlist({
  //     //   productId: productObj?.id,
  //     //   vendorId: productObj?.vendorId,
  //     //   quantity: qty,
  //     //   product: productObj,
  //     //   variation: cloneVariation?.selectedVariation ? cloneVariation?.selectedVariation : null,
  //     //   price: productObj?.sale_price || productObj?.price,
  //     // })
  //     //   .then(console.log)
  //     //   .catch(console.error)
  //     // console.dir({ env: process.env })
  //     console.log('paramsssssssssssssssss', params)
  //     const updatedWishlist = await remoteAddToWishlist({
  //       productId: productObj?.productId,
  //       vendorId: productObj?.vendorId,
  //       quantity: qty,
  //       product: productObj,
  //       variation: cloneVariation?.selectedVariation ? cloneVariation?.selectedVariation : null,
  //       price: productObj?.sale_price || productObj?.price,
  //     })
  //       .then(json => {
  //         // refetch()
  //         console.log('json', json)
  //         isCookie
  //           ? setWishlistProducts(prev => [...prev, json])
  //           : setWishlistProducts(prev => [...prev, params])
  //         return json
  //       })
  //       .catch(console.error)
  //   } else {
  //     console.log('updatedQtyyyyyy3', updatedQty)
  //     // Checking the Stock QTY of paricular product
  //     const productStockQty = Wishlist[index]?.variation?.quantity
  //       ? Wishlist[index]?.variation?.quantity
  //       : Wishlist[index]?.product?.quantity
  //     if (productStockQty < Wishlist[index]?.quantity + qty) {
  //       ToastNotification(
  //         'error',
  //         `You can not add more items than available. In stock ${productStockQty} items.`
  //       )
  //       return false
  //     }
  //     console.log('updatedQtyyyyyy4', updatedQty)
  //     if (Wishlist[index]?.variation) {
  //       Wishlist[index].variation.selected_variation = Wishlist[index]?.variation?.attribute_values
  //         ?.map(values => values.value)
  //         .join('/')
  //     }
  //     console.log('qty', qty)
  //     const newQuantity = updatedQty
  //     console.log('updatedQtyyyyyy5', updatedQty)
  //     const params = {
  //       quantity: updatedQty
  //     };
  //     if (newQuantity < 1) {
  //       // Remove the item from the Wishlist if the new quantity is less than 1
  //       return removeWishlist(productObj?.productId, WishlistUid ? WishlistUid : Wishlist[index].id)
  //       refetch();
  //     } else {
  //       console.log('newQuantity', newQuantity)
  //       console.log('productObj?.productId', productObj?.productId)
  //       const result = await remoteUpdateWishlist(productObj?.productId, newQuantity)
  //       refetch();

  //       const updatedWishlist = Wishlist.map((item, idx) => {
  //         if (idx === index) {
  //           return { ...item, quantity: newQuantity };
  //         }
  //         return item;
  //       });

  //       setWishlistProducts(updatedWishlist);
        
  //       console.log('result', result)
  //       // Wishlist[index] = {
  //       //   ...Wishlist[index],
  //       //   id: WishlistUid?.id ? WishlistUid?.id : Wishlist[index].id ? Wishlist[index].id : null,
  //       //   quantity: newQuantity,
  //       //   sub_total:
  //       //     newQuantity *
  //       //     (Wishlist[index]?.variation
  //       //       ? Wishlist[index]?.variation?.sale_price
  //       //       : Wishlist[index]?.product?.sale_price),
  //       // }
  //       // console.log({ Updated_Product_To_Wishlist: Wishlist })
  //       // // const updatedWishlist = await remoteUpdateWishlist({})
  //       // isCookie ? setWishlistProducts([...Wishlist]) : setWishlistProducts([...Wishlist])
  //     }
  //   }
  //   console.log('updatedQtyyyyyy6', updatedQty)
  //   // Update the productQty state immediately after updating the WishlistProducts state
  //   if (isCookie) {
  //     setIsProductQty && setIsProductQty(updatedQty)
  //     isOpenFun && isOpenFun(false)
  //   } else {
  //     setIsProductQty && setIsProductQty(updatedQty)
  //     isOpenFun && isOpenFun(false)
  //   }
  //   console.log('updatedQtyyyyyy7', updatedQty)
  //   setWishlistCanvas(true)
  //   console.log('updatedQtyyyyyy8', updatedQty)
  //   console.log('WishlistProductssssssssssssssssssssssssssssssssssssssssssss', WishlistProducts)
  // }

  // // Replace Wishlist
  // const replaceWishlist = (updatedQty, productObj, cloneVariation) => {
  //   console.log({
  //     ReplaceWishlist: {
  //       updatedQuantity: updatedQty,
  //       product: {
  //         id: productObj.id,
  //         name: productObj.name,
  //         slug: productObj.slug,
  //         vendorId: productObj.vendorId,
  //       },
  //       clone: cloneVariation,
  //     },
  //   })
  //   // const Wishlist = [...WishlistProducts]
  //   // const index = Wishlist.findIndex(item => item.product_id === productObj?.id)
  //   // Wishlist[index].quantity = 0

  //   // const productQty = Wishlist[index]?.variation
  //   //   ? Wishlist[index]?.variation?.quantity
  //   //   : Wishlist[index]?.product?.quantity

  //   // if (Wishlist[index]?.variation) {
  //   //   Wishlist[index].variation.selected_variation = Wishlist[index]?.variation?.attribute_values
  //   //     ?.map(values => values.value)
  //   //     .join('/')
  //   // }

  //   // // Checking the Stock QTY of paricular product
  //   // if (productQty < Wishlist[index]?.quantity + updatedQty) {
  //   //   ToastNotification(
  //   //     'error',
  //   //     `You can not add more items than available. In stock ${productQty} items.`
  //   //   )
  //   //   return false
  //   // }

  //   // const params = {
  //   //   id: null,
  //   //   product: productObj,
  //   //   product_id: productObj?.id,
  //   //   variation: cloneVariation?.selectedVariation ? cloneVariation?.selectedVariation : null,
  //   //   variation_id: cloneVariation?.selectedVariation?.id
  //   //     ? cloneVariation?.selectedVariation?.id
  //   //     : null,
  //   //   quantity: cloneVariation?.productQty ? cloneVariation?.productQty : updatedQty,
  //   //   sub_total: cloneVariation?.selectedVariation?.sale_price
  //   //     ? updatedQty * cloneVariation?.selectedVariation?.sale_price
  //   //     : updatedQty * productObj?.sale_price,
  //   // }

  //   // isCookie
  //   //   ? setWishlistProducts(prevWishlistProducts =>
  //   //       prevWishlistProducts.map(elem => {
  //   //         if (elem?.product_id === cloneVariation?.selectedVariation?.product_id) {
  //   //           return params
  //   //         } else {
  //   //           return elem
  //   //         }
  //   //       })
  //   //     )
  //   //   : setWishlistProducts(prevWishlistProducts =>
  //   //       prevWishlistProducts.map(elem => {
  //   //         if (elem?.product_id === cloneVariation?.selectedVariation?.product_id) {
  //   //           return params
  //   //         } else {
  //   //           return elem
  //   //         }
  //   //       })
  //   //     )
  // }

  // // Setting data to localstroage when UAT is not there
  // const storeInLocalStorage = () => {
  //   localStorage.setItem('Wishlist', JSON.stringify({ items: WishlistProducts, total: total }))
  // }

  return (
    <WishlistContext.Provider
      value={{
        ...props,
        WishlistProducts,
        setWishlistProducts,
        clickUpdate,
        setClickUpdate
        // WishlistTotal,
        // setWishlistTotal,
        // removeWishlist,
        // getTotal,
        // getTotalNotSale,
        // handleIncDec,
        // variationModal,
        // setVariationModal,
        // replaceWishlist,
      }}
    >
      {props.children}
    </WishlistContext.Provider>
  )
}

export default WishlistProvider
