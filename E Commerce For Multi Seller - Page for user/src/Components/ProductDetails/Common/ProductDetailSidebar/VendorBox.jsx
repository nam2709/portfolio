import ProductBox1Rating from '@/Components/Common/ProductBox/ProductBox1/ProductBox1Rating'
import StoreVendor from '@/Components/Seller/Stores/StoreVendor'
import { useContext, useState } from 'react'
import I18NextContext from '@/Helper/I18NextContext'
import { fetchAuthSession } from 'aws-amplify/auth'
import useSWR from 'swr'
import Loader from '@/Layout/Loader'
import { Alert } from 'reactstrap'
import Link from 'next/link'
import Avatar from '@/Components/Common/Avatar'

const VendorBox = ({ productState }) => {
  const { i18Lang } = useContext(I18NextContext)
  const [ vendorInfo, setVendorInfo ] = useState(null)

  const fetchVendor = async () => {
    const token = await fetchAuthSession()
      .then(session => session?.tokens?.idToken?.toString())
      .catch(error => null)
    const vendor = await  fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors/${productState?.product?.vendorId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then(res => res.json())

    // console.log({ token, order })
    return vendor
  }

  const { data, error, isLoading } = useSWR(`/vendors/${productState?.product?.vendorId}`, fetchVendor)
  // useEffect(() => {
  //   if (productState) {
  //     const fetchVendorInfo = async () => {
  //       try {
  //         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors/${productState?.product?.vendorId}`);
  //         const vendor = await response.json(); // Parse JSON response
  //         setVendorInfo(vendor); // Update state with the fetched vendor info
  //       } catch (error) {
  //         console.error('Failed to fetch vendor info:', error);
  //       }
  //     };

  //   fetchVendorInfo();
  //   }
  // }, [productState]);
  if (isLoading) return <Loader />
  if (error) return <Alert color="danger">Error: {error.message}</Alert>
  return (
    <div className="vendor-box">
      <div className="vendor-contain">
          <Link
            href={`/${i18Lang}/seller/stores/${productState?.product?.vendorId}`}>
            <div className="vendor-image">
            <Avatar
              data={data?.store_logo}
              height={64}
              width={64}
              name={productState?.product?.store?.store_name}
            />
            </div>
          </Link>
        <div className="vendor-name">
          <Link
            href={`/${i18Lang}/seller/stores/${productState?.product?.vendorId}`}>
          <h5 className="fw-500">{data?.name}</h5>
          </Link>

          <div className="product-rating mt-2">
            <span style={{ color: 'orange', fontWeight: 'bold' }}>UY TÍN - CHẤT LƯỢNG</span>
            {/* <ProductBox1Rating
              totalRating={productState?.product?.store?.rating_count}
            />
            <span>{`(${productState?.product?.store?.reviews_count ?? 0} Đánh giá)`}</span> */}
          </div>
        </div>
      </div>

      <p className="vendor-detail">
        {data?.description}
      </p>

      <div className="vendor-list">
        <ul>
          <StoreVendor elem={data} data={data} />
        </ul>
      </div>
    </div>
  )
}

export default VendorBox
