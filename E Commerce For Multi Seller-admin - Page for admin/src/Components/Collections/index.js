'use client'
import { Approved, product } from '../../Utils/AxiosUtils/API'
import TableWarper from '../../Utils/HOC/TableWarper'
import ShowTable from '../Table/ShowTable'
import Loader from '../CommonComponent/Loader'
import I18NextContext from '@/Helper/I18NextContext'
import usePermissionCheck from '../../Utils/Hooks/usePermissionCheck'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useTranslation } from '@/app/i18n/client'
import { placeHolderImage } from '../../Data/CommonPath'
import { useSearchParams } from 'next/navigation';
// import AccountContext from '../../Helper/AccountContext'
// import { useContext } from 'react'
import { RiDeleteBinLine } from 'react-icons/ri'
import { FaPlus } from "react-icons/fa";
import { useEffect, useState, useContext } from 'react'
import { fetchAuthSession } from 'aws-amplify/auth'
import { ToastNotification } from '@/Utils/CustomFunctions/ToastNotification'

// const CollectionsContain = ({ data, ...props }) => {
const CollectionsContain = () => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const [modal, setModal] = useState(false);
  const [edit, destroy] = usePermissionCheck(['edit', 'destroy'])
  const [data, setData] = useState()
  const [categories, setCategories] = useState()
  const [productId, setProductId] = useState()
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${category}/products`
      );
      const result = await response.json();
      setData(result); // Update state with fetched data
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`
      );
      const result = await response.json();
      setCategories(result); // Update state with fetched data
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    if (category) {
      fetchData();
      fetchCategories();
    }
  }, [category]);

  const handleRemove = async (productId) => {
    const token = await fetchAuthSession()
      .then(session => session?.tokens?.idToken?.toString())
      .catch(error => null);
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${category}/products/${productId}`,
        {
          method: 'DELETE',
          headers: {  // Changed 'header' to 'headers'
            Authorization: `Bearer ${token}`,  // Prefix token with 'Bearer'
          },
        }
      );
      
      const result = await response.json();
      ToastNotification('success', 'Xóa sản phẩm khỏi danh mục thành công')
      console.log('result', result);
      await fetchData();
    } catch (error) {
      ToastNotification('error', 'Xóa sản phẩm vào danh mục thất bại')
      console.error('Error removing product:', error);
    }
  };

  const handleAddCategory = async (productId) => {
    setModal(!modal)
    setProductId(productId)
  };

  const handleAdd = async (categoryId) => {
    const token = await fetchAuthSession()
      .then(session => session?.tokens?.idToken?.toString())
      .catch(error => null);
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}/products/${productId}`,
        {
          method: 'POST',
          headers: {  // Changed 'header' to 'headers'
            Authorization: `Bearer ${token}`,  // Prefix token with 'Bearer'
          },
        }
      );
      
      const result = await response.json();
      ToastNotification('success', 'Thêm sản phẩm vào danh mục thành công')
      console.log('result', result);
      await fetchData();
    } catch (error) {
      ToastNotification('error', 'Thêm sản phẩm vào danh mục thất bại')
      console.error('Error removing product:', error);
    }
  }
  
  const headerObj = {
    checkBox: false,
    isOption: edit == false && destroy == false ? false : true,
    noEdit: edit ? false : true,
    optionHead: { title: 'Action' },
    column: [
      {
        title: 'Image',
        apiKey: 'product_thumbnail',
        subKey: ['url'],
        type: 'image',
        placeHolderImage: placeHolderImage,
      },
      { title: 'Name', apiKey: 'name', sorting: true, sortBy: 'desc' },
      { title: 'Price', apiKey: 'sale_price', sorting: true, sortBy: 'desc', type: 'price' },
      { title: 'Stock', apiKey: 'stock_status', type: 'stock_status' },
      // { title: 'StoreName', apiKey: 'store', subKey: ['store_name'] },
      // { title: 'Store Status', apiKey: 'store', subKey: ['store_status'] },
      { title: 'Status', apiKey: 'status' },
      { title: 'Product Id', apiKey: 'productId' },
      {
        title: 'Action',
        render: (tableData) => (
          <ul className="country-list">
          <button onClick={() => handleAddCategory(tableData.productId)} style={{ background: 'transparent', border: 'none', padding: 0}}>
            <FaPlus style={{ width: '30px' }} />
          </button>
          <button onClick={() => handleRemove(tableData.productId)} style={{ background: 'transparent', border: 'none', padding: 0}}>
            <RiDeleteBinLine style={{ width: '30px' }} />
          </button>
          </ul>
        )
      }
    ],
    data: data || [],
  }
  headerObj.data.map(element => (element.sale_price = element?.sale_price))

  if (!data) return <Loader />
  return (
    <>
      {/* <ShowTable {...props} headerData={headerObj} /> */}
      <ShowTable headerData={headerObj} />
      <Modal isOpen={modal}>
        <ModalHeader>{t('AddToCategorySub')}</ModalHeader>
        <ModalBody>
          <ul>
            {categories?.find(cat => cat.categoryId === category)?.subcategories?.map(subcategory => (
              <li key={subcategory.id}>
                <button onClick={() => handleAdd(subcategory.id)} style={{ background: 'transparent', border: 'none', padding: 0}}>
                  {subcategory.name}
                </button>
              </li>
            ))}
          </ul>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModal(!modal)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default TableWarper(CollectionsContain)
