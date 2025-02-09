import ProductDetailContent from '@/Components/ProductDetails'
import { headers } from 'next/headers'

export async function generateMetadata({ params }) {
  // fetch data
  const productData = await fetch(
    `${headers().get('host')}/product/${params?.productSlug}`
  )
    .then(res => res.json())
    .catch(err => console.log('err', err))
  return {
    title: productData?.name,
    description: productData?.short_description,
    openGraph: {
      title: productData?.meta_title,
      description: productData?.meta_description,
      images: [productData?.product_meta_image?.original_url, []],
    },
  }
}

const ProductDetails = ({ params }) => {
  return <ProductDetailContent params={params?.productSlug} />
}

export default ProductDetails
