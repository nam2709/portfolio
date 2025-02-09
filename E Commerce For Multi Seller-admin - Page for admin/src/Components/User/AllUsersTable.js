import TableWarper from '../../Utils/HOC/TableWarper'
import ShowTable from '../Table/ShowTable'
import Loader from '../CommonComponent/Loader'
import usePermissionCheck from '../../Utils/Hooks/usePermissionCheck'

const AllUsersTable = ({ data, ...props }) => {
  console.log('props', props)
  console.log('data', data)
  // Calculate indices for pagination
  const startIndex = (props?.current_page - 1) * props?.per_page;
  const endIndex = startIndex + props?.per_page;

  // Slice data based on pagination
  const paginatedData = data?.slice(startIndex, endIndex) || [];

  const [edit, destroy] = usePermissionCheck(['edit', 'destroy'])
  const headerObj = {
    checkBox: true,
    isOption: edit == false && destroy == false ? false : true,
    noEdit: edit ? false : true,
    isSerialNo: false,
    optionHead: { title: 'Action' },
    column: [
      { title: 'Avatar', apiKey: 'profile_image', type: 'image', class: 'sm-width' },
      { title: 'Name', apiKey: 'name', sorting: true, sortBy: 'desc' },
      { title: 'Email', apiKey: 'email', sorting: true, sortBy: 'desc' },
      // { title: 'Role', apiKey: 'role', subKey: ['name'] },
      { title: 'CreateAt', apiKey: 'created_at', sorting: true, sortBy: 'desc', type: 'date' },
      { title: 'UserConfirm', apiKey: 'UserStatus' },
      { title: 'Enabled', apiKey: 'status', type: 'switch'},
    ],
    data: paginatedData,
  }
  if (!data) return <Loader />
  return (
    <>
      <ShowTable {...props} headerData={headerObj} />
    </>
  )
}

export default TableWarper(AllUsersTable)
