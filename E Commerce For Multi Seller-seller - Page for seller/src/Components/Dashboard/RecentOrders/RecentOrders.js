import { useContext, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import TableWarper from '../../../Utils/HOC/TableWarper'
import ShowTable from '../../Table/ShowTable'

const RecentOrders = ({ data, ...props }) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const router = useRouter()
  const getSpanTag = number => {
    return <span className="fw-bolder">#{number}</span>
  }
  const sortedData = data && data?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
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
      { title: 'Payment', apiKey: 'status' },
    ],
    data: sortedData?.slice(0, 30)?.map(elem => elem) || [],
  }
  let orders = useMemo(() => {
    return headerObj?.data?.filter(element => {
      element.order_number = getSpanTag(element.order_number)
      element.status = element.status ? (
        <div className={`status-${element?.status.toString().toLowerCase() || ''}`}>
          <span>{t(element?.status)}</span>
        </div>
      ) : (
        '-'
      )
      return element
    })
  }, [data])
  headerObj.data = headerObj ? orders : []

  const redirectLink = data => {
    const order_number = data?.order_number?.props?.children?.[1]
    router.push(`/${i18Lang}/order/details/${order_number}`)
  }
  return <ShowTable {...props} headerData={headerObj} redirectLink={redirectLink} />
}

export default TableWarper(RecentOrders)
