'use client'
import { useContext, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import TableWarper from '../../../Utils/HOC/TableWarper'
import ShowTable from '../../Table/ShowTable'

const RecentOrders = ({ data, ...props }) => {
  // console.log('RecentOrders', { data, props })
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const router = useRouter()
  const getSpanTag = number => {
    return <span className="fw-bolder">#{number}</span>
  }
  const headerObj = {
    checkBox: false,
    isOption: true,
    noEdit: false,
    isSerialNo: false,
    optionHead: {
      title: 'Action',
      type: 'View',
      redirectUrl: '/order/details',
      modalTitle: t('Orders'),
    },
    noCustomClass: true,
    column: [
      { title: 'Number', apiKey: 'order_number' },
      { title: 'Date', apiKey: 'created_at', sorting: true, sortBy: 'desc', type: 'date' },
      { title: 'Name', apiKey: 'consumer', subKey: ['name'] },
      { title: 'Amount', apiKey: 'total', type: 'price' },
      { title: 'Payment', apiKey: 'payment_status' },
      { title: 'Status', apiKey: 'order_status', subKey: ['name'] },
    ],
    data: data?.slice(0, 30)?.map(elem => elem) || [],
  }
  let orders = useMemo(() => {
    // console.log({ RECENT_ORDERS: data, headerObj })
    return headerObj?.data?.filter(element => {
      element.order_number = getSpanTag(element.order_number)
      element.payment_status = element.payment_status ? (
        <div className={`status-${element?.payment_status.toString().toLowerCase() || ''}`}>
          <span>{element?.payment_status}</span>
        </div>
      ) : (
        '-'
      )
      // element.order_status = element.order_status ? (
      //   <div className={`status-${element?.order_status?.name.toString().toLowerCase() || ''}`}>
      //     <span>{element?.order_status?.name}</span>
      //   </div>
      // ) : (
      //   '-'
      // )
      return element
    })
  }, [data])

  headerObj.data = headerObj ? orders : []

  const redirectLink = data => {
    const order_number = data?.order_number?.props?.children?.[1]
    console.log('REDIRECT TO ORDER DETAILS', order_number)
    router.push(`/${i18Lang}/order/details/${order_number}`)
  }
  return <ShowTable {...props} headerData={headerObj} redirectLink={redirectLink} />
}

export default TableWarper(RecentOrders)
