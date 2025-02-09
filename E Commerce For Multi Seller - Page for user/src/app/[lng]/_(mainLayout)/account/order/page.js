import AccountOrders from '@/Components/Account/Orders'
import { getOrders } from '@/app/actions/orders'
import { headers } from 'next/headers'

// async function fetchOrders() {
//   const host = headers().get('host')
//   const protocol = headers().get('x-forwarded-proto') || 'http'
//   return fetch(`${protocol}://${host}/api/orders`, { method: 'GET' })
//     .then(res => res.json())
//     .then(json => {
//       console.log('GET ORDERS', json)
//       return json
//     })
//     .catch(error => {
//       console.error('GET ORDERS ERROR', error.message)
//       return []
//     })
// }

const Orders = async () => {
  const orders = await getOrders()
  console.log('USER ORDERS', orders)
  // console.log('FETCH ORDERS', await fetchOrders())
  return <AccountOrders />
}

export default Orders
