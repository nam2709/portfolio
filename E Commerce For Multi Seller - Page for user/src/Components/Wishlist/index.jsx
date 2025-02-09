'use client'
import { useEffect, useState, useContext } from 'react'
import AccountContext from '@/Helper/AccountContext'
// import { useQuery } from '@tanstack/react-query'
import { Col } from 'reactstrap'
import Breadcrumb from '../Common/Breadcrumb'
import WrapperComponent from '../Common/WrapperComponent'
import ProductBox1 from '../Common/ProductBox/ProductBox1/ProductBox1'
import emptyImage from '../../../public/assets/svg/empty-items.svg'
// import request from '@/Utils/AxiosUtils'
import Loader from '@/Layout/Loader'
import useSWR from 'swr'
import  Cookies from 'js-cookie'
import { fetchAuthSession } from 'aws-amplify/auth'
import WishlistContext from '@/Helper/WishlistContext'
import NoDataFound from '@/Components/Common/NoDataFound'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
// import { WishlistAPI } from '@/Utils/AxiosUtils/API'

const WishlistContent =  () => {
  const { setWishlistProducts } = useContext(WishlistContext)
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
//   const session = await fetchAuthSession().catch(console.error)
// console.log(session?.tokens?.idToken.toString())
  // const { auth } = useContext(AccountContext);

  const [wishlistState, setWishlistState] = useState([]);

  const fetchWishlist = async () =>
    await fetchAuthSession().catch(console.error)
      .then(res => 
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${res?.tokens?.idToken.toString()}`,
          },
        })
          .then(res => res.json())
      )

  const { data, error, isLoading } = useSWR(`/wishlist`, fetchWishlist)

  useEffect(() => {
    if (data) {
      setWishlistState([...data])
      setWishlistProducts([...data])
    }
  }, [data])
  // if (!token) return <Loader />
  // if (isLoading) return <Loader />; 

  // Function to delete an item from the wishlist
  const deleteItem = async (itemId) => {
    const token = await fetchAuthSession().catch(console.error)
    if (token?.tokens?.idToken.toString()) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token?.tokens?.idToken.toString()}`,
        },
        body: JSON.stringify({ productId: itemId })
      });
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
  
      setWishlistState(wishlistState.filter(item => item.id !== itemId));
      console.log('wishlistState',  wishlistState)
      setWishlistProducts(wishlistState.filter(item => item.id !== itemId))
    }
    
  };

  // Function to manually refetch the wishlist
  const refetch = () => {
    mutate('/wishlist');
  };
  console.log('wishlistState', wishlistState)
  return (
    <>
      <Breadcrumb title={'Wishlist'} subNavigation={[{ name: 'Wishlist' }]} />

      <WrapperComponent
        classes={{
          sectionClass: 'wishlist-section section-b-space',
          row: 'g-sm-3 g-2',
        }}
        customCol={true}
      >
        {wishlistState && wishlistState.length > 0 ? 
          wishlistState.map(product => (
              <Col
                  xxl={2}
                  lg={3}
                  md={4}
                  xs={6}
                  className="product-box-contain"
                  key={product.id}
              >
                  <ProductBox1
                      imgUrl={product?.product_thumbnail}
                      productDetail={product}
                      isClose={true}
                      refetch={refetch}
                      classObj={{ productBoxClass: 'product-box-3' }}
                      setWishlistState={setWishlistState}
                      setWishlistProducts={setWishlistProducts}
                      deleteItem={deleteItem}
                  />
              </Col>
          )) 
          : (
              <NoDataFound
                  data={{
                      customClass: 'no-data-added',
                      imageUrl: emptyImage,
                      title: t('NoItemsAdded'),
                      description: t('NoItemsAddedDescription'),
                      height: 300,
                      width: 300,
                  }}
              />
          )
        }
      </WrapperComponent>
    </>
  )
}

export default WishlistContent
