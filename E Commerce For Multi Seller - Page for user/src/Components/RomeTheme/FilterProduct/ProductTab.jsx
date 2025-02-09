import { useContext, useEffect, useState } from 'react'
import { Row, TabContent, TabPane } from 'reactstrap'
import ProductSection1 from '@/Components/HomePages/ProductSections/ProductSection1'
import ProductContext from '@/Helper/ProductContext'

const ProductTab = ({ activeTab, filterCategoryData }) => {
  const { productData } = useContext(ProductContext)
  const [filterData, setFilterData] = useState([])
  useEffect(() => {
    if (productData?.length > 0) {
      setFilterData(
        productData
          ?.filter(product =>
            product?.categories
              ?.map(category => category.id)
              .includes(filterCategoryData[activeTab - 1]?.id)
          )
          ?.map(product => product)
          .slice(0, 5)
      )
    }
  }, [productData, filterCategoryData[activeTab - 1]?.id])
  return (
    <TabContent>
      <TabPane>
        <Row className="g-8">
          <ProductSection1
            ProductData={filterData}
            classObj={{
              productStyle: 'product-standard',
              productBoxClass: 'product-box-bg',
            }}
            isHeadingVisible={false}
          />
        </Row>
      </TabPane>
    </TabContent>
  )
}

export default ProductTab
