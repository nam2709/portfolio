'use client'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Loader from '@/Layout/Loader'
import request from '@/Utils/AxiosUtils'
import { ProductAPI } from '@/Utils/AxiosUtils/API'
import Breadcrumb from '../Common/Breadcrumb'
import RelatedProduct from './Common/RelatedProduct'
import ProductThumbnail from './ProductThumbnail'
import ThemeOptionContext from '@/Helper/ThemeOptionsContext'
import { useRouter, useSearchParams } from 'next/navigation'
import ProductIdsContext from '@/Helper/ProductIdsContext'
import StickyCheckout from './Common/StickyCheckout'
import useSWR from 'swr'
import { getHostApi } from '@/Utils/AxiosUtils'
import { Col } from 'reactstrap'
import Image from 'next/image'
import WrapperComponent from '../Common/WrapperComponent'
import NotFoundImage from '../../../public/assets/images/inner-page/402.png'
import Btn from '@/Elements/Buttons/Btn'

const ProductDetailContent = ({ params }) => {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data: ProductData, error, isLoading } = useSWR(`${getHostApi()}/product/${params}`, fetcher)
  const router = useRouter()
  const { themeOption } = useContext(ThemeOptionContext)
  const { setGetProductIds, isLoading: productLoader } = useContext(ProductIdsContext)
  const searchParams = useSearchParams()
  const queryProductLayout = searchParams.get('layout')
  // Getting Product Layout
  const isProductLayout = useMemo(() => {
    return queryProductLayout
      ? queryProductLayout
      : themeOption?.product?.product_layout ?? 'product_thumbnail'
  }, [queryProductLayout, themeOption])

  const [productState, setProductState] = useState({
    product: [],
    attributeValues: [],
    productQty: 1,
    selectedVariation: '',
    variantIds: [],
  })

  // Calling Product API on slug
  // const {
  //   data: ProductData,
  //   isLoading,
  //   refetch,
  // } = useQuery(
  //   [params],
  //   () => request({ url: `${ProductAPI}/${params}` }, router),
  //   { enabled: false, refetchOnWindowFocus: false, select: res => res?.data }
  // )

  // Calling Product API when params is there
  // useEffect(() => {
  //   params && refetch()
  // }, [params])

  // Setting Product API Data on state Variable and getting ids from cross_sell_products,related_products;
  useEffect(() => {
    if (ProductData) {
      ;(ProductData?.cross_sell_products?.length > 0 ||
        ProductData?.related_products?.length > 0) &&
        setGetProductIds({
          ids: Array.from(
            new Set([
              ...ProductData?.cross_sell_products,
              ...ProductData?.related_products,
            ])
          ).join(','),
        })
      setProductState({ ...productState, product: ProductData })
    }
  }, [isLoading])

  useEffect(() => {
    const handleScroll = () => {
      const button = document.querySelector('.scroll-button')
      if (button) {
        const buttonRect = button.getBoundingClientRect()
        if (buttonRect.bottom < window.innerHeight && buttonRect.bottom < 0) {
          document.body.classList.add('stickyCart')
        } else {
          document.body.classList.remove('stickyCart')
        }
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      // Clean up the event listener when the component unmounts
      window.removeEventListener('scroll', handleScroll)
      document.body.classList?.remove('stickyCart')
    }
  }, [])

  if (isLoading) return <Loader />

  return (
    <> 
      {ProductData ? 
        <>
          <Breadcrumb
            title={ProductData?.name}
            subNavigation={[
              { name: 'Product' },
              { name: Array.isArray(ProductData?.categories) ? ProductData?.categories[0]?.name : ProductData?.name},
            ]}
          />
          <ProductThumbnail
            productState={productState}
            setProductState={setProductState}
          />
          ,
          {productState?.product?.related_products?.length > 0 && (
            <RelatedProduct productState={productState} />
          )}
          {ProductData && (
            <StickyCheckout ProductData={ProductData} isLoading={isLoading} />
          )}
        </> : 
        <>
          <Breadcrumb title={'404'} subNavigation={[{ name: '404' }]} />
          <WrapperComponent
            classes={{ sectionClass: 'section-404 section-lg-space' }}
            customCol
          >
            <Col xs="12">
              <div className="image-404">
                <Image
                  src={NotFoundImage}
                  className="img-fluid"
                  alt="error page"
                  height={483.52}
                  width={392.61}
                />
              </div>
            </Col>
            <Col xs={12}>
              <div className="contain-404">
                <h3 className="text-content">
                  The product is no longer available
                </h3>
                <Btn
                  id="back_button"
                  className="btn-md text-white theme-bg-color mt-4 mx-auto"
                  title={themeOption?.error_page?.back_button_text}
                  onClick={() => router.back()}
                />
              </div>
            </Col>
          </WrapperComponent>
        </>
      }
    </>
  )
}

export default ProductDetailContent
