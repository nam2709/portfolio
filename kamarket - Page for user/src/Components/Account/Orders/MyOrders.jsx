'use client'
import { useContext, useState, useEffect } from 'react'
import Link from 'next/link'
import { RiEyeLine } from 'react-icons/ri'
import { Alert, Table } from 'reactstrap'
import Cookies from 'js-cookie'
import NoDataFound from '@/Components/Common/NoDataFound'
import Pagination from '@/Components/Common/Pagination'
import Loader from '@/Layout/Loader'
import { dateFormate } from '@/Utils/CustomFunctions/DateFormate'
import emptyImage from '../../../../public/assets/svg/empty-items.svg'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import AccountHeading from '@/Components/Common/AccountHeading'
import useSWR from 'swr'
import { fetchAuthSession } from 'aws-amplify/auth'
import { getHostApi } from '@/Utils/AxiosUtils'
import './Order.css'
const formatCurrency = amount => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

const fetchOrders = async (status) => {
  const token = await fetchAuthSession()
    .then(session => session?.tokens?.idToken?.toString())
    .catch(error => null)

  return await fetch(`${getHostApi()}order?status=${status}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(orders => {
      console.log(orders)
      return orders
    })
    .then(orders =>
      orders?.data?.map(order => ({
        ...order,
        order_number: order?.orderId,
        created_at: order?.createdAt,
        total: order?.amount || order?.Amount,
        payment_method: order?.payment_method || 'COD',
      }))
    )
}

const MyOrders = ({status}) => {
  const [page, setPage] = useState(1)
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const [orders, setOrders] = useState([]);
  const { data, error, isLoading } = useSWR(`/orders?status=${status}`, () => fetchOrders(status))
  console.log('orderdata', data)

  useEffect(() => {
    if (data) {
      setOrders(data);
    }
  }, [data])

  if (isLoading) return <Loader />
  if (error)
    return (
      <Alert color="danger">
        {t('Error')}: {error.message}
      </Alert>
    )

  // console.log(data)

  return (
    <>
      {/* <AccountHeading title="MyOrders" /> */}
      {orders?.length > 0 ? (
        <>
          <div className="total-box mt-0">
            <div className="wallet-table1 mt-0">
              <Table>
                <tbody>
                  <tr>
                    <th>{t('STT')}</th>
                    <th>{t('OrderNumber')}</th>
                    <th>{t('Date')}</th>
                    <th>{t('Amount')}</th>
                    <th>{t('OrderStatus')}</th>
                    <th>{t('PaymentStatus')}</th>
                    <th>{t('PaymentMethod')}</th>
                    <th>{t('Option')}</th>
                  </tr>
                  {orders?.map((order, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>
                        <span className="fw-bolder">#{order.orderId}</span>
                      </td>
                      <td>{dateFormate(order?.created_at)}</td>
                      <td>{formatCurrency(order?.total)} </td>
                      <td>
                        <div className={`status-${order?.order_status?.name.toLowerCase()}`}>
                          <span>{order.status ? order.status : order?.order_status?.name}</span>
                        </div>
                      </td>
                      <td>
                        <div className={`status-${order?.payment_status?.toLowerCase()}`}>
                          <span>{order.payment_status ? order?.payment_status : order?.payment_status?.name}</span>
                        </div>
                      </td>
                      <td>{order?.payment_method.toUpperCase()}</td>
                      <td>
                        <Link href={`/${i18Lang}/account/order/${order.orderId}`}>
                          <RiEyeLine />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
          <nav className="custome-pagination">
            <Pagination
              current_page={orders?.current_page}
              total={orders?.total}
              per_page={orders?.per_page}
              setPage={setPage}
            />
          </nav>
        </>
      ) : (
        <NoDataFound
          data={{
            customClass: 'no-data-added',
            imageUrl: emptyImage,
            title: t('No Orders Found'),
            description: t('No orders have been made yet'),
            height: 300,
            width: 300,
          }}
        />
      )}
    </>
  )
}

export default MyOrders
