import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Col, Row } from 'reactstrap'
import NoDataFound from '@/Components/Common/NoDataFound'
import Pagination from '@/Components/Common/Pagination'
import ProductBox1 from '@/Components/Common/ProductBox/ProductBox1/ProductBox1'
import request from '@/Utils/AxiosUtils'
import { ProductAPI } from '@/Utils/AxiosUtils/API'
import { useQuery } from '@tanstack/react-query'
import noProduct from '../../../../public/assets/svg/no-product.svg'
import ProductSkeletonComponent from '@/Components/Common/SkeletonLoader/ProductSkeleton/ProductSkeletonComponent'
import useSWR from 'swr'
import { getHostApi } from '@/Utils/AxiosUtils'

const CollectionProducts = ({ filter, grid }) => {
  const { slug } = useParams()
  const [page, setPage] = useState(1)
  const perPage = 5

  async function fetchProducts() {
    const response = await fetch(`${getHostApi()}/product`, {
        headers: {
            Accept: 'application/json',
            // Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    // Filter products with status 'pre-order'
    const preOrderProducts = data.filter(product => product.stock_status === 'pre-order');
    return preOrderProducts;
  }
  const { data: fillProducts, error, isLoading, mutate } = useSWR(`/products`, fetchProducts)

  const [filterProduct, setFilterProduct] = useState([])

  useEffect(() => {
    if (fillProducts && fillProducts.length > 0) {
      const start = (page - 1) * perPage
      const end = start + perPage
      setFilterProduct(fillProducts.slice(start, end))
    }
  }, [fillProducts, page, perPage])

  return (
    <>
      {isLoading ? (
        <Row
          xxl={grid}
          xl={grid}
          lg={grid}
          md={3}
          xs={2}
          className={`g-sm-4 g-3 product-list-section ${grid == 'list' ? 'list-style' : ''}`}
        >
          <ProductSkeletonComponent item={40} />
        </Row>
      ) : filterProduct?.length > 0 ? (
        <Row
          xxl={grid}
          xl={grid}
          lg={grid}
          md={3}
          xs={2}
          className={`g-sm-4 g-3 product-list-section ${grid == 'list' ? 'list-style' : ''}`}
        >
          {filterProduct?.map((product, i) => (
            <Col key={i}>
              <ProductBox1
                imgUrl={product?.product_thumbnail}
                productDetail={{ ...product }}
                classObj={{ productBoxClass: 'product-box-3' }}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <NoDataFound
          data={{
            imageUrl: noProduct,
            customClass: 'no-data-added collection-no-data',
            title: "Sorry! Couldn't find the products you were looking For!",
            description:
              'Please check if you have misspelt something or try searching with other way.',
            height: 345,
            width: 345,
          }}
        />
      )}

      {filterProduct?.length > 0 && (
        <nav className="custome-pagination">
          <Pagination
            current_page={page}
            total={fillProducts.length}
            per_page={perPage}
            setPage={setPage}
          />
          {/* <Pagination
            current_page={filterProduct?.current_page}
            total={filterProduct?.total}
            per_page={filterProduct?.per_page}
            setPage={setPage}
          /> */}
        </nav>
      )}
    </>
  )
}

export default CollectionProducts