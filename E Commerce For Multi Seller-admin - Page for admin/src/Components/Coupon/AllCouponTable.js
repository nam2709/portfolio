import TableWarper from '../../Utils/HOC/TableWarper'
import ShowTable from '../Table/ShowTable'
import usePermissionCheck from '../../Utils/Hooks/usePermissionCheck'

const AllCouponTable = ({ data, ...props }) => {
  console.log('data', data)
  const [edit, destroy] = usePermissionCheck(['edit', 'destroy'])
  const headerObj = {
    checkBox: true,
    isOption: edit == false && destroy == false ? false : true,
    noEdit: edit ? false : true,
    optionHead: { title: 'Action' },
    column: [
      { title: 'Name', apiKey: 'code', sorting: true, sortBy: 'desc' },
      { title: 'CreateAt', apiKey: 'createdAt', sorting: true, sortBy: 'desc', type: 'date' },
      { title: 'Role', apiKey: 'EntityType' },
      { title: 'Seller', apiKey: 'creator' },
      { title: 'Type', apiKey: 'type' },
      { title: 'Amount', apiKey: 'amount' },
    ],
    data: data || [],
  }
  if (!data) return null
  return (
    <>
      <ShowTable {...props} headerData={headerObj} />
    </>
  )
}

export default TableWarper(AllCouponTable)
