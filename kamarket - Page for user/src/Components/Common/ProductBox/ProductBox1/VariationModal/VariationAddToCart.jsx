import Btn from '@/Elements/Buttons/Btn'
import CartContext from '@/Helper/CartContext'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import { useContext } from 'react'
import { RiShoppingCartLine } from 'react-icons/ri'
import { fetchAuthSession } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation'

const VariationAddToCart = ({ cloneVariation, setVariationModal }) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const { cartProducts, handleIncDec } = useContext(CartContext)
  const productNotOutOfStock = cloneVariation?.selectedVariation
    ? cloneVariation?.selectedVariation?.stock_status !== 'out_of_stock'
    : cloneVariation?.product?.stock_status !== 'out_of_stock'
  const router = useRouter()

  const addToCart = async allProduct => {
    const token = await fetchAuthSession().catch(console.error)
    if (token?.tokens?.idToken.toString()) {
      if (cloneVariation?.selectedVariation) {
        console.log({ AddToCart: cloneVariation.selectedVariation })
        handleIncDec(cloneVariation.productQty, allProduct, false, false, false, cloneVariation)
        setVariationModal(false)
      } else {
        console.log({ AddToCart: allProduct })
        handleIncDec(cloneVariation.productQty, allProduct, false, false, false)
        setVariationModal(false)
      }
    } else {
      router.push(`/${i18Lang}/auth/login`);
    }
  }
  return (
    <div className="addtocart_btn">
      <Btn
        className="btn btn-md fw-bold icon text-white theme-bg-color view-button text-uppercase"
        disabled={
          (cloneVariation?.selectedVariation &&
            cloneVariation?.selectedVariation?.stock_status == 'out_of_stock') ||
          (cloneVariation?.product?.stock_status == 'out_of_stock' && true)
        }
        onClick={() => addToCart(cloneVariation.product)}
      >
        <RiShoppingCartLine />
        <span>{productNotOutOfStock ? t('AddToCart') : t('SoldOut')}</span>
      </Btn>
    </div>
  )
}
export default VariationAddToCart
