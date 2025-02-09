import WishlistContent from '@/Components/Wishlist'
import { getWishlist } from '@/app/actions/wishlist'

const title = 'Yêu thích - Mua sắm hàng chất giá sỉ Online'
const description =
  'Freeship Toàn quốc 0Đ hàng triệu sản phẩm chất lượng. Gian hàng KaMall chính hãng, Shop Xịn uy tín, Hoàn tiền đến 300K mỗi ngày. Mở App mua sắm ngay!'

export const metadata = {
  title,
  description,
  keywords: '',
  openGraph: {
    title,
    description,
  },
  twitter: {
    creator: '@kamarket',
    card: 'summary_large_image',
    title,
    description,
  },
}

const Wishlist = async () => {
  const wishlist = await getWishlist()
  console.log('USER WISHLIST', wishlist)
  return <WishlistContent />
}

export default Wishlist
