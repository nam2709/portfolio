import { useEffect, useState } from 'react'
import ProductIdsContext from '.'
import { useQuery } from '@tanstack/react-query'
import { ProductAPI } from '@/Utils/AxiosUtils/API'
import request from '@/Utils/AxiosUtils'

const ProductIdsProvider = props => {
  const [getProductIds, setGetProductIds] = useState({})
  const [filteredProduct, setFilteredProduct] = useState([])
  const { data, refetch, isLoading } = useQuery(
    [ProductAPI, getProductIds?.ids],
    () => request({ url: ProductAPI, params: { ...getProductIds, status: 1 } }),
    {
      enabled: false,
      refetchOnWindowFocus: false,
      select: data => data.data,
    }
  )
  useEffect(() => {
    Object.keys(getProductIds).length > 0 && refetch()
  }, [getProductIds?.ids])

  useEffect(() => {
    if (Array.isArray(data)) {
      setFilteredProduct(data);
    } else {
      // console.error('Expected data to be an array, received:', data);
      setFilteredProduct([]);  // Reset or handle error appropriately
    }
  }, [isLoading, getProductIds])
  return (
    <ProductIdsContext.Provider
      value={{ ...props, filteredProduct, setGetProductIds, isLoading }}
    >
      {props.children}
    </ProductIdsContext.Provider>
  )
}

export default ProductIdsProvider
