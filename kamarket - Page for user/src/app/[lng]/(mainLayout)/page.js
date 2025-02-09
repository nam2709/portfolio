import HomeComponent from '@/Components/HomePages'

const title = 'Kamarket - Mua sắm hàng chất giá sỉ Online'
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

export default async function HomePage({ params }) {
  return <HomeComponent />
}
