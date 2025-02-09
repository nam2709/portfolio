import { Approved, product } from '../../Utils/AxiosUtils/API'
import TableWarper from '../../Utils/HOC/TableWarper'
import ShowTable from '../Table/ShowTable'
import Loader from '../CommonComponent/Loader'
import usePermissionCheck from '../../Utils/Hooks/usePermissionCheck'
import { placeHolderImage } from '../../Data/CommonPath'
import AccountContext from '../../Helper/AccountContext'
import { useContext } from 'react'

const AllProductTable = ({ products, data, ...props }) => {
  const [edit, destroy] = usePermissionCheck(['edit', 'destroy'])
  const { role, setRole } = useContext(AccountContext)

  // useEffect(() => {
  //   const storedRole = localStorage.getItem("role");
  //   if (storedRole) {
  //     const parsedRole = JSON.parse(storedRole);
  //     setRole(parsedRole.name);
  //   }
  // }, [])

  const headerObj = {
    checkBox: true,
    isOption: edit == false && destroy == false ? false : true,
    noEdit: edit ? false : true,
    optionHead: { title: 'Action' },
    column: [
      {
        title: 'Image',
        apiKey: 'product_thumbnail',
        type: 'image',
        placeHolderImage: placeHolderImage,
      },
      { title: 'Name', apiKey: 'name', sorting: true, sortBy: 'desc', type: 'name' },
      { title: 'Price', apiKey: 'price', sorting: true, sortBy: 'desc', type: 'price' },
      { title: 'SalePrice', apiKey: 'sale_price', sorting: true, type: 'price' },
      // { title: 'Categories', apiKey: 'categories', type: 'categories' },
      { title: 'Sold', apiKey: 'orders_count', type: 'orders_count' },
      { title: 'Stock', apiKey: 'quantity', type: 'quantity' },
      // { title: 'StoreName', apiKey: 'store', subKey: ['store_name'] },
      { title: 'Approved', apiKey: 'status', type: 'switch', url: `${product}${Approved}` },
      // { title: 'Status', apiKey: 'status', type: 'switch' },
    ],
    data: products || [],
  }

  // headerObj?.data.map(element => (element.sale_price = element?.sale_price))

  // let pro = headerObj?.column?.filter(elem => {
  //   return role == 'vendor' ? elem.title !== 'APPROVED' : elem
  // })
  // headerObj.column = headerObj ? pro : []
  if (!products) return <Loader />
  return (
    <>
      <ShowTable {...props} headerData={headerObj} />
    </>
  )
}

export default TableWarper(AllProductTable)
