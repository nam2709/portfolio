import { useContext, useMemo } from 'react'
import CustomHeading from '@/Components/Common/CustomHeading'
// import ProductBox2 from '@/Components/Common/ProductBox/ProductBox2/ProductBox2';
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import { RiArrowRightFill } from 'react-icons/ri'
import Btn from '@/Elements/Buttons/Btn'
import ProductBox1 from '@/Components/Common/ProductBox/ProductBox1/ProductBox1'
import { Col, Row } from 'reactstrap'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useSWR from 'swr'


const ProductSection4 = ({
  dataAPI,
  ProductData,
  svgUrl,
  noCustomClass,
  customClass,
  classObj,
}) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  // const filterProduct = useMemo(() => {
  //   return ProductData?.filter(el => dataAPI?.product_ids?.includes(el.id))
  // }, [ProductData, dataAPI])
  // const router = useRouter()
  async function fetchProducts() {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      headers: {
        Accept: 'application/json',
        // Authorization: `Bearer ${token}`,
      },
    }).then(res => res.json())
  }
  const { data: filterProduct, error, isLoading, mutate } = useSWR(`/products`, fetchProducts)
  return (
    <>
      <CustomHeading
        linkNext="/daily-discover"
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
      <div className="best-selling-slider product-wrapper">
        <div className="position-relative">
          <Row>
            {
              Array.isArray(filterProduct) ?
              filterProduct?.map((elem, index) => (
                <Col xs={6} md={3} key={index} className="mb-3 p-1 h-100 max-w-250">
                  <ProductBox1
                    imgUrl={elem?.product_thumbnail}
                    productDetail={{ ...elem }}
                    classObj={classObj}
                  />
                </Col>
              )):
              <></>
              // console.error('filterProduct is not an array:', filterProduct)
            }
          </Row>
        </div>
        <div className="d-flex justify-content-center align-items-center pt-3 pt-md-5 pb-3 pb-md-5">
          <Link
            href={`/${i18Lang}/daily-discover`}
            className="button-readmore-link"
          >
            {t('Xem Tất Cả')} <RiArrowRightFill />
          </Link>
        </div>
      </div>
    </>
  )
}

export default ProductSection4
