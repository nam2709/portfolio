import { useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname} from 'next/navigation'
import { Col, Row } from 'reactstrap'
import NoDataFound from '@/Components/Common/NoDataFound'
import Pagination from '@/Components/Common/Pagination'
import ProductBox1 from '@/Components/Common/ProductBox/ProductBox1/ProductBox1'
import request from '@/Utils/AxiosUtils'
// import { ProductAPI } from '@/Utils/AxiosUtils/API'
// import { useQuery } from '@tanstack/react-query'
import noProduct from '../../../../public/assets/svg/no-product.svg'
import ProductSkeletonComponent from '@/Components/Common/SkeletonLoader/ProductSkeleton/ProductSkeletonComponent'
import { getHostApi } from '@/Utils/AxiosUtils'

const CollectionProducts = ({ filter, grid }) => {
  const params = useSearchParams()
  const pathname = usePathname()
  const categoryId = params.get('category')
  const attribute = params.get('attribute')
  const rating = params.get('rating')
  
  const segments = pathname.split('/');
  const storeId = segments[segments.indexOf('stores') + 1];
  // console.log('rating', rating)
  // console.log('atribute', attribute)
  // const ProductAPI = `${process.env.NEXT_PUBLIC_API_URL}/collections?categories=${categoryId}`
  const ProductAPI = storeId 
  ? `${getHostApi()}/product?vendorId=${storeId}`
  : categoryId
  ? `${getHostApi()}/categories/${categoryId}`
  : `${getHostApi()}/products`;
  // console.log('ProductAPI', ProductAPI)
  // const { slug } = useParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState(null)
  const [filteredData, setFilteredData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    setIsLoading(true)
    fetch(ProductAPI, {
      headers: {
        Accept: 'application/json',
      },
    })
      .then(response => {
        console.log('Full Response:', response)
        return response.json()
      })
      .then(data => {
        setData(data)
        setIsLoading(false)
      })
      .catch(error => {
        console.log('error', error)
      })
  }, [categoryId])

  // console.log('datadata', data)
  useEffect(() => {
    // Function to check if attribute filter should be applied based on prefix
    const getCityFromAttribute = (attributes) => {
      // Filter out all attributes that start with 'TP-' and transform them into a normalized format
      return attributes.filter(attr => attr.startsWith('TP-'))
                       .map(attr => attr.substring(3).toLowerCase().replace(/ /g, '-'));
    };

    // Function to normalize city names (e.g., "Hà Nội" to "ha-noi")
    const normalizeCityName = (cityName) => {
      return cityName.normalize('NFD') // Normalize to decomposed normal form
                  .replace(/[\u0300-\u036f]/g, '') // Strip diacritics
                  .toLowerCase() // Convert to lowercase
                  .replace(/ /g, '-') // Replace spaces with hyphens
                  .replace(/thanh-pho-/g, '')
    };

    if (data && rating || data && attribute || data && rating && attribute) {
      const citiesFromAttribute = getCityFromAttribute(filter.attribute || []);
      const requiredRatings = rating ? rating.split(',')?.map(Number) : [];

      // Map over data and filter products
      const filtered = data.filter(product => {
          const roundedRating = Math.floor(product.rating_count);
          // Check if product meets the ratings criteria
          const meetsRatingCriteria = !requiredRatings.length || requiredRatings.includes(roundedRating);
          console.log('meetsRatingCriteria', meetsRatingCriteria);

          let meetsAttributeCriteria = true;
          if (citiesFromAttribute.length) {
              const productCityNormalized = normalizeCityName(product.store?.city || '');
              console.log('Product City Normalized:', productCityNormalized, 'Cities:', citiesFromAttribute);
              meetsAttributeCriteria = citiesFromAttribute.includes(productCityNormalized);
          }

          console.log('meetsAttributeCriteria', meetsAttributeCriteria);

          // Only include product if it meets both rating and attribute criteria
          return meetsRatingCriteria && meetsAttributeCriteria;
        });

        setFilteredData(filtered);
    } else {
        setFilteredData(data);
    }
  }, [data, filter.rating, filter.attribute]);

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem)
  console.log('currentItems', currentItems)

  return (
    <>
      {isLoading ? (
        <Row
          xxl={grid !== 3 && grid !== 5 ? 4 : ''}
          xl={grid == 5 ? 5 : 3}
          lg={grid == 5 ? 4 : 2}
          md={3}
          xs={2}
          className={`g-sm-4 g-3 product-list-section ${grid == 'list' ? 'list-style' : ''}`}
        >
          <ProductSkeletonComponent item={40} />
        </Row>
      ) : data && !isLoading ? (
        <Row
          xxl={grid !== 3 && grid !== 5 ? 4 : ''}
          xl={grid == 5 ? 4 : 3}
          lg={grid == 5 ? 3 : 2}
          md={3}
          xs={2}
          className={`g-sm-4 g-3 product-list-section ${grid == 'list' ? 'list-style' : ''}`}
        >
          {currentItems?.map((item, index) =>
            // item.map((product, i) => (
              <Col key={`${index}`}>
                <ProductBox1
                  imgUrl={item?.product_thumbnail}
                  productDetail={{ ...item }}
                  classObj={{ productBoxClass: 'product-box-3' }}
                />
              </Col>
            )
          }
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

      {data?.length > 0 && (
        <nav className="custome-pagination">
          <Pagination
            current_page={currentPage}
            total={filteredData?.length}
            per_page={itemsPerPage}
            setPage={setCurrentPage}
          />
        </nav>
      )}
    </>
  )
}

export default CollectionProducts
