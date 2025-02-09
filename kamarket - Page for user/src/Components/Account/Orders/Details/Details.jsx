import Loader from '@/Layout/Loader'
import DetailStatus from './DetailStatus'
import DetailTitle from './DetailTitle'
import DetailsTable from './DetailsTable'
import DetailsConsumer from './DetailsConsumer'
import SubOrders from './SubOrders'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import { fetchAuthSession } from 'aws-amplify/auth'
import { Alert } from 'reactstrap'
import { getHostApi } from '@/Utils/AxiosUtils'

const Details = ({ params }) => {
  const fetchOrders = async () => {
    const token = await fetchAuthSession()
      .then(session => session?.tokens?.idToken?.toString())
      .catch(error => null)
    const order = await fetch(`${getHostApi()}order/${params}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then(res => res.json())

    // console.log({ token, order })
    return order
  }

  const { data, error, isLoading } = useSWR(`/orders/${params}`, fetchOrders)


  if (isLoading) return <Loader />
  if (error) return <Alert color="danger">Error: {error.message}</Alert>

  return (
    <>
      <DetailTitle params={params} data={data} />
      <DetailStatus data={data} />
      <DetailsTable data={data} />
      <DetailsConsumer data={data} />
      {data?.sub_orders?.length > 0 ? <SubOrders data={data} /> : null}
    </>
  )
}

export default Details
