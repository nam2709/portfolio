'use client'
import { useContext, useRef, useState } from 'react'
import { Card, CardBody, Col, Row, Input } from 'reactstrap'
import TreeForm from '@/Components/category/TreeForm'
import CategoryForm from '@/Components/category/CategoryForm'
import CollectionSlider from '@/Components/CollectionSlider/CollectionSlider'
import TableTitle from '@/Components/Table/TableTitle'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import { GoArrowRight } from "react-icons/go";

const CategoryCreate = () => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const [testCategory, setTestCateogry] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [ formType, setFormType ] = useState('create')
  const refRefetch = useRef()

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    console.log('Selected Option:', selectedValue);
  };
  
  return (
    <>
      <CollectionSlider testCategory={testCategory} />
      <br></br>
      <Row>
        <Col xl="4">
          <Card>
            <CardBody>
              <TableTitle moduleName="Category" type={'product'} onlyTitle={true} />
              <TreeForm type={'product'} ref={refRefetch} />
            </CardBody>
          </Card>
        </Col>
        <Col xl="8">
          <Card>
            <CardBody>
              <Row className="align-items-center">
                <Col xs="12" md="4" lg="6">
                {
                  formType === 'create' ? (
                    <div className="title-header option-title">
                      <h5>{t('AddCategory')}</h5>
                    </div>
                  ) : formType === 'addProduct' ? (
                    <div className="title-header option-title">
                      <h5>{t('AddProduct')}</h5>
                    </div>
                  ) : (
                    <div className="title-header option-title">
                      <h5>{t('AddCategorySub')}</h5>
                    </div>
                  )
                }
                </Col>
                {
                  formType === 'create' ? (
                    <>
                      <Col xs="12" md="4" lg="3" style={{paddingBottom: '30px'}}>
                        <button
                          type="button"
                          title="Thêm Người dùng"
                          className="align-items-center btn-theme add-button btn btn-secondary"
                          onClick={() => setFormType('createSub')}
                        >
                          <div>{t('AddCategorySub')}</div>
                        </button>
                      </Col>
                      <Col xs="12" md="4" lg="3" style={{paddingBottom: '30px'}}>
                        <button
                          type="button"
                          title="Thêm Người dùng"
                          className="align-items-center btn-theme add-button btn btn-secondary"
                          onClick={() => setFormType('addProduct')}
                        >
                          <div>{t('AddProduct')}</div>
                        </button>
                      </Col>
                    </>
                  ) : (
                    <>
                      <Col xs="12" md="4" lg="3" style={{paddingBottom: '30px'}}>
                        <button
                          type="button"
                          title="Thêm Người dùng"
                          className="align-items-center btn-theme add-button btn btn-secondary"
                          onClick={() => setFormType('create')}
                        >
                          <div>{t('Create')}</div>
                        </button>
                      </Col>
                    </>
                  )
                }
              </Row>
              <CategoryForm type={'product'} setTestCateogry={setTestCateogry} formType={formType} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default CategoryCreate
