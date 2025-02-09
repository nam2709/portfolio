import dynamic from 'next/dynamic'
// import { redirect } from 'next/navigation'

const MainDashboard = dynamic(() => import('../../../../Components/Dashboard'), { ssr: false })
import { verifySession } from '@/app/actions/user'

async function getRecentOrders() {
  const token = await verifySession()
    .then(session => session?.tokens?.idToken.toString())
    .catch(() => null)

  const orders = fetch(`${process.env.API_URL}/admin/orders`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    // .then(({ Items }) => Items)
    .catch(error => {
      console.error(error.message)
      return []
    })
  return orders
}

const Dashboard = async () => {
  // const orders = await getRecentOrders()
  // console.log({ orders })
  return <MainDashboard />
}

export default Dashboard
