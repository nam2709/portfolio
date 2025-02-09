import { useContext, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

import TableWarper from '../../Utils/HOC/TableWarper'
import ShowTable from '../Table/ShowTable'
import ShipmentForm from '../Shipments/ShipmentForm'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import { FaTruck } from "react-icons/fa";

const AllOrdersTable = ({ data, ...props }) => {
  const [ isOpenShip, setIsOpenShip ] = useState(false)
  const [ orderId, setOrderId ] = useState(null)
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const router = useRouter()

  const getSpanTag = number => {
    return <span className="fw-bolder">#{number}</span>
  }

  console.log('data', data)

  const headerObj = {
    checkBox: false,
    isOption: true,
    isShipping: true,
    optionHead: {
      title: 'Action',
      type: 'View',
      redirectUrl: '/order/details',
      modalTitle: t('Orders'),
    },
    column: [
      { title: 'OrderNumber', apiKey: 'order_number' },
      { title: 'OrderDate', apiKey: 'created_at', sorting: true, sortBy: 'desc', type: 'date' },
      { title: 'CustomerName', apiKey: 'consumer', subKey: ['name'] },
      { title: 'TotalAmount', apiKey: 'total', type: 'price' },
      { title: 'OrderStatus', apiKey: 'order_status', subKey: ['name'] },
      { title: 'PaymentStatus', apiKey: 'payment_status' },
      { title: 'PaymentMode', apiKey: 'payment_method' },
      // {
      //   title: 'Shipping', apiKey: 'total', type: 'price',
      //   render: (data) => (
      //     // <button onClick={() => setIsOpenShip(!isOpenShip)} style={{ background: 'transparent', border: 'none', padding: 0}}>
      //       <FaTruck style={{width: '36px'}} />
      //     // </button>
      //   )
      // }
    ],
    data: data || [],
  }
  let orders = useMemo(() => {
    return headerObj?.data?.filter(element => {
      element.order_number = getSpanTag(element.order_number)
      console.log(' element.order_status.name',  element.order_status.name)
      element.order_status.name = (
        <div className={`status-${element?.order_status?.name.toString().toLowerCase() || ''}`}>
          <span>{element?.order_status?.name.toUpperCase()}</span>
        </div>
      )
      element.payment_status = element.payment_status ? (
        <div className={`status-${element?.payment_status.toString().toLowerCase() || ''}`}>
          <span>{element?.payment_status}</span>
        </div>
      ) : (
        '-'
      )
      element.payment_mode = element.payment_method ? (
        <div className="payment-mode">
          <span>{element?.payment_method}</span>
        </div>
      ) : (
        '-'
      )
      element.consumer_name = <span className="text-capitalize">{element.consumer.name}</span>
      return element
    })
  }, [headerObj?.data])
  headerObj.data = headerObj ? orders : []

  const redirectLink = data => {
    const order_number = data?.order_number?.props?.children?.[1]
    router.push(`/${i18Lang}/order/details/${order_number}`)
  }

  const handleShip = data => {
    console.log('handleShip', data)
    setOrderId(data?.id)
    setIsOpenShip(true)
  }

  if (!data) return null

  return (
    <>
      <ShowTable {...props} headerData={headerObj} redirectLink={redirectLink} handleShip={handleShip} />
      <ShipmentForm orderId={orderId} modal={isOpenShip} setModal={setIsOpenShip}/>
    </>
  )
}

export default TableWarper(AllOrdersTable)
