import { Approved, product } from '../../Utils/AxiosUtils/API'
import TableWarper from '../../Utils/HOC/TableWarper'
import ShowTable from '../Table/ShowTable'
import Loader from '../CommonComponent/Loader'
import usePermissionCheck from '../../Utils/Hooks/usePermissionCheck'
import { placeHolderImage } from '../../Data/CommonPath'
import AccountContext from '../../Helper/AccountContext'
import { useContext } from 'react'
import { useEffect } from 'react'

const AllProductTable = ({ data, ...props }) => {
  const [edit, destroy] = usePermissionCheck(['edit', 'destroy'])
  const { role, setRole } = useContext(AccountContext)

  console.log('data', data)
  useEffect(() => {
    const storedRole = localStorage.getItem('role')
    if (storedRole) {
      const parsedRole = JSON.parse(storedRole)
      setRole(parsedRole.name)
    }
  }, [])

  const headerObj = {
    checkBox: true,
    isOption: true,
    noEdit: false,
    column: [
      {
        title: 'Image',
        apiKey: 'product_thumbnail',
        type: 'image',
        placeHolderImage: placeHolderImage,
      },
      { title: 'Name', apiKey: 'name', sorting: true, sortBy: 'desc' },
      { title: 'Price', apiKey: 'sale_price', sorting: true, sortBy: 'desc', type: 'price' },
      { title: 'Stock', apiKey: 'stock_status', type: 'stock_status' },
      { title: 'StoreName', apiKey: 'store', subKey: ['store_name'] },
      { title: 'Store Status', apiKey: 'store', subKey: ['store_status'] },
      { title: 'Approved', apiKey: 'is_approved', type: 'switch', url: `${product}${Approved}` },
      { title: 'Status', apiKey: 'product_status' },
    ],
    data: data || [],
  }
  headerObj.data.map(element => (element.sale_price = element?.sale_price))

  let pro = headerObj?.column?.filter(elem => {
    return role == 'vendor' ? elem.title !== 'Approved' : elem
  })
  headerObj.column = headerObj ? pro : []
  if (!data) return <Loader />
  return (
    <>
      <ShowTable {...props} headerData={headerObj} />
    </>
  )
}

export default TableWarper(AllProductTable)
