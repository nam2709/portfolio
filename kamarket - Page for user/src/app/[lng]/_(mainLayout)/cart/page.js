import CartContent from '@/Components/Cart'
import { getCart } from '@/app/actions/carts'

const Cart = () => {
  const cart = await getCart()
  console.log('USER CART', cart)
  return <CartContent />
}

export default Cart
