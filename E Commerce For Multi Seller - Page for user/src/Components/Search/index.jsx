'use client'
import { useContext, useEffect, useState } from 'react'
import Breadcrumb from '../Common/Breadcrumb'
// import { LeafSVG } from '../Common/CommonSVG';
import { Input, InputGroup } from 'reactstrap'
import WrapperComponent from '../Common/WrapperComponent'
import Btn from '@/Elements/Buttons/Btn'
import { useRouter, useSearchParams } from 'next/navigation'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import SearchedData from './SearchedData'
import { LuSearchCheck } from 'react-icons/lu'
// import ProductContext from '@/Helper/ProductContext';
import Data from '@/app/api/product/product.json'
import useSWR from 'swr'
import _ from 'lodash'
import SearchBox from '../../Layout/Header/MinimalHeaderComponent/SearchBox'

const fetcher = (url) => fetch(url).then((res) => res.json());

const SearchModule = () => {
  const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/products?fields=id,name,price,short_description,sale_price,orders_count,rating_count,product_galleries,product_thumbnail`, fetcher)
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const [searchState, setSearchState] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const search = searchParams.get('search')
  //  const { productData } = useContext(ProductContext);
  const [dataSearch, setDataSearch] = useState([])
  function includes(a, b) {
    return a.toLowerCase().includes(b.toLowerCase())
  }

  function check(product, key) {
    return includes(product?.name || '', key) || includes(product?.short_description || '', key)
  }

  console.log('search', search)
  console.log('data', data)

  useEffect(() => {
    if(data && search){
        const searchTerm = search.toLowerCase().trim();
        const searchKeyword = _.deburr(searchTerm);
        const results = data.filter((product) => {
        const productName = _.deburr(product?.name?.toLowerCase());
        const productCategory = _.deburr(product?.short_description?.toLowerCase());

        // Kiểm tra xem từ khóa có tồn tại trong cả trường tên và trường mô tả ngắn hay không
        return (
          productName && productName.includes(searchKeyword)) ||
          productCategory && productCategory.includes(searchKeyword)
      });
      setDataSearch(results);
    }
  }, [data, search])
  // const onHandleSearch = () => {
  //   router.push(`/${i18Lang}/search?search=${searchState}`)
  // }
  // const onChangeHandler = value => {
  //   if (!value) {
  //     router.push(`/${i18Lang}/search?search=`)
  //   }
  //   setSearchState(value)
  // }
  return (
    <>
      <Breadcrumb title={'Search'} subNavigation={[{ name: 'Search' }]} />
      <SearchBox />
      <WrapperComponent
        classes={{ sectionClass: 'search-section', col: 'mx-auto' }}
        colProps={{ xxl: 6, xl: 8 }}
      >
      </WrapperComponent>
      <SearchedData data={dataSearch} />
    </>
  )
}

export default SearchModule
