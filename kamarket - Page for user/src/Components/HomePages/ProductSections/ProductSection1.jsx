import { useMemo, useEffect } from 'react'
import { Col, Row } from 'reactstrap'
import Slider from 'react-slick'
import CustomHeading from '@/Components/Common/CustomHeading'
import { productSliderOption } from '../../../../Data/SliderSettingsData'
import ProductBox1 from '@/Components/Common/ProductBox/ProductBox1/ProductBox1'
import { useQuery } from '@tanstack/react-query'
import useSWR from 'swr'
import { getHostApi } from '@/Utils/AxiosUtils'

const ProductSection1 = ({
  dataAPI,
  ProductData,
  svgUrl,
  noCustomClass = false,
  customClass,
  classObj,
  customSliderOption = productSliderOption,
  isHeadingVisible = true,
  linkPage,
}) => {
  // const filterProduct = useMemo(() => {
  //   return ProductData?.filter(el =>
  //     dataAPI?.product_ids ? dataAPI?.product_ids?.includes(el.id) : el
  //   )
  // }, [ProductData, dataAPI])
  async function fetchProducts() {
    return fetch(`${getHostApi()}/product`, {
      headers: {
        Accept: 'application/json',
        // Authorization: `Bearer ${token}`,
      },
    }).then(res => res.json())
  }
  const { data: filterProduct, error, isLoading, mutate } = useSWR(`/products`, fetchProducts)
  // console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
  // console.log('filterProduct', filterProduct)

  return (
    <>
      {isHeadingVisible ? (
        <CustomHeading
          linkNext={linkPage}
          title={dataAPI?.title}
          svgUrl={svgUrl}
          subTitle={dataAPI?.description}
          customClass={
            customClass
              ? customClass
              : noCustomClass
                ? ''
                : 'section-t-space title d-block'
          }
        />
      ) : null}
      <div className={`${classObj?.productStyle} overflow-hidden`}>
        <div className="no-arrow">
        <Slider {...customSliderOption}>
          {
            Array.isArray(filterProduct) ?
            filterProduct.sort((a, b) => {
              // Prioritize by is_sale_enable first
              if (a.is_sale_enable && !b.is_sale_enable) {
                return -1;
              }
              if (!a.is_sale_enable && b.is_sale_enable) {
                return 1;
              }

              if (a.is_featured && !b.is_featured) {
                return -1;
              }
              if (!a.is_featured && b.is_featured) {
                return 1;
              }
              // If both properties are the same, maintain existing order
              return 0;
            }).map(elem => (
              <div key={elem?.id} className='d-center'>
                <Col xs={12} className="p-2 max-w-250">
                  <ProductBox1
                    imgUrl={elem?.product_thumbnail}
                    productDetail={{ ...elem }}
                    classObj={classObj}
                  />
                </Col>
              </div>
            ))
            :
            <></>
            // console.error('filterProduct is not an array:', filterProduct)
          }
        </Slider>
        </div>
      </div>
    </>
  )
}

export default ProductSection1
