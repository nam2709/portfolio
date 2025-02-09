import React, { useContext, useEffect, useMemo, useState } from 'react'
import I18NextContext from '@/Helper/I18NextContext'
import { useQuery } from '@tanstack/react-query'
import { Form, Formik } from 'formik'
import { Row, Col, Input, FormGroup, Label } from 'reactstrap'
import request from '../../Utils/AxiosUtils'
import { nameSchema, YupObject } from '../../Utils/Validation/ValidationSchemas'
import SimpleInputField from '../InputFields/SimpleInputField'
import FileUploadField from '../InputFields/FileUploadField'
import FormBtn from '../../Elements/Buttons/FormBtn'
import CheckBoxField from '../InputFields/CheckBoxField'
import MultiSelectField from '../InputFields/MultiSelectField'
import Loader from '../CommonComponent/Loader'
import CategoryContext from '../../Helper/CategoryContext'
import { Category } from '../../Utils/AxiosUtils/API'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useTranslation } from '@/app/i18n/client'
import { getHostApi } from '@/Utils/AxiosUtils';
import { fetchAuthSession } from 'aws-amplify/auth'
import { ToastNotification } from '@/Utils/CustomFunctions/ToastNotification'

const handleCreateCategory = async (result) => {
  try {
    const token = await fetchAuthSession()
      .then(session => session?.tokens?.idToken?.toString())
      .catch(error => null)

    let baseURl = `${process.env.NEXT_PUBLIC_API_URL}/categories`
    if (result?.type === 'translation') {
      baseURl= `${process.env.NEXT_PUBLIC_API_URL}/categories-lang`
    }

    if (!token) throw new Error('Unauthorized')
    const response = await fetch(baseURl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(result),
    });

    if (!response.ok) {
      throw new Error('Failed to submit the form');
    }

    const data = await response.json();
    ToastNotification('success', 'Tạo mới danh mục thành công')
    console.log('Form submitted successfully:', data);
  } catch (error) {
    ToastNotification('error', 'Cập nhập danh mục thất bại')
    console.error('Error submitting the form:', error);
  }
}

const handleUpdateCategory = async (result) => {
  try {
    const token = await fetchAuthSession()
      .then(session => session?.tokens?.idToken?.toString())
      .catch(error => null)

    let baseURl = `${process.env.NEXT_PUBLIC_API_URL}/category/${result?.categoryId}`

    if (!token) throw new Error('Unauthorized')
    const response = await fetch(baseURl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(result),
    });

    if (!response.ok) {
      throw new Error('Failed to submit the form');
    }

    const data = await response.json();
    ToastNotification('success', 'Cập nhập danh mục thành công')
    console.log('Form submitted successfully:', data);
  } catch (error) {
    ToastNotification('error', 'Cập nhập danh mục thất bại')
    console.error('Error submitting the form:', error);
  }
}

const handleAddProductCategory = async (result) => {
  try {
    const token = await fetchAuthSession()
      .then(session => session?.tokens?.idToken?.toString())
      .catch(() => null);

    if (token) {
      const respone = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${result?.categoryId}/products/${result?.productId}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await respone.json();
      ToastNotification("success", 'Thêm sản phẩm vào danh mục thành công')
    }
  } catch (error) {
    ToastNotification('error', 'Cập nhập sản phẩm vào danh mục thất bại')
    console.error('Error submitting the form:', error);
  }
}

const CategoryForm = ({ setResetData, updateId, type, setTestCateogry, formType }) => {
  console.log('updateId', updateId)
  const [categoryData, setCategoryData] = useState(null)
  const [productData, setProductData] = useState(null)
  const [state, setState] = useState(true)
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const router = useRouter()
  const { categoryState } = useContext(CategoryContext)
  const {
    data: oldData,
    isLoading,
    refetch,
  } = useQuery([updateId], () => request({ url: `${Category}/${updateId}` }), {
    enabled: false,
    refetchOnWindowFocus: false,
  })

  const pathname = usePathname()
  const search = useSearchParams()
  const searchparam = search.toString()
  const currentPath = pathname + (searchparam ? `?${searchparam}` : '');
  const langCode = decodeURIComponent(currentPath).match(/\.lang=([a-zA-Z-]+)/)?.[1];

  console.log('formType', formType)

  useEffect(() => {
    // Fetch categories data from API
    const fetchCategoriesData = async () => {
      try {
        const res = await fetch(`${process.env.API_URL}/categories`, { method: 'GET' });
        if (!res.ok) throw new Error(`Error fetching categories data: ${res.statusText}`);
        const data = await res.json();
        console.log('fetchCategoriesData', data)
        setCategoryData(data)
        return data;
      } catch (error) {
        console.error(error);
        return [];
      }
    };
    fetchCategoriesData()
  }, [])

  useEffect(() => {
    // Fetch categories data from API
    const fetchProductsData = async () => {
      const token = await fetchAuthSession()
      .then(session => session?.tokens?.idToken?.toString())
      .catch(error => null)

      if (!token) throw new Error('Unauthorized')
      const products = await fetch(`${process.env.API_URL}/admin/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(products => {
          console.dir({ ADMIN_PRODUCTS: products }, { depth: 3 })
          setProductData(products)
        })
        .catch(error => {
          console.error('ERROR while fetching products', JSON.stringify(error))
        })
    }
    fetchProductsData()
  }, [])

  useEffect(() => {
    updateId && refetch()
  }, [updateId])
  const updatedData = useMemo(() => {
    return categoryState
  }, [categoryState])
  if (updateId && isLoading) return <Loader />
  
  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: updateId ? oldData?.data?.name || '' : '',
        description: updateId ? oldData?.data?.description || '' : '',
        category_image_id: updateId ? oldData?.data?.category_image?.id || '' : '',
        // category_icon_id: updateId ? oldData?.data?.category_icon?.id : '',
        category_image: updateId ? oldData?.data?.category_image || '' : '',
        lang: updateId ? oldData?.data?.lang || '' : '',
        categoryId: updateId ? oldData?.data?.categoryId || '' : '',
        productId: '',
        isActive: updateId ? oldData?.data?.isActive || '' : '',
        // category_icon: updateId ? oldData?.data?.category_icon : '',
        // commission_rate: updateId ? oldData?.data?.commission_rate : '',
        // type: type,
        // status: updateId ? Boolean(Number(oldData?.data?.status)) : true,
        // parent_id: updateId ? Number(oldData?.data?.parent_id) || undefined : undefined,
        submitter: '',
      }}
      validationSchema={formType !== 'addProduct' ? YupObject({
        name: nameSchema,
      }) : null}
      onSubmit={async (values) => {
        console.log('values', values)
        if (values.submitter === 'test') {
          const result = {
              PK: "CATEGORY",
              categoryId: "abc123",
              name: values?.name,
              description: values?.description,
              original_url: values?.category_image?.url,
          };
          setTestCateogry(result);
        } else {
            if (formType === 'create') {
                const result = {
                  name: values?.name,
                  description: values?.description,
                  original_url: values?.category_image?.url,
                  lang: values?.lang
                };
                const respone = await handleCreateCategory(result);
                console.log('respone', respone)
            } else if (formType === 'createSub') {
                const result = {
                  name: values?.name,
                  description: values?.description,
                  original_url: values?.category_image?.url,
                  lang: values?.lang,
                  categoryId: values?.categoryId
                };
                const respone = await handleCreateCategory(result);
                console.log('respone', respone)
            } else if (formType === 'update' && langCode) {
              console.log('here')
                const currentId = updateId.replace(/\.lang(%3D|=)[a-zA-Z-]+/, '');
                const categoryId = currentId.replace(/\./g, '#SUB');
                const result = {
                  name: values?.name,
                  description: values?.description,
                  lang: langCode,
                  categoryId: categoryId,
                  type: 'translation'
                };
                const respone = await handleCreateCategory(result);
                console.log('respone', respone)
            } else if (formType === 'update' && !langCode) {
              console.log('here')
                const categoryId = updateId.replace(/\.lang(%3D|=)[a-zA-Z-]+/, '');
                const result = {
                  name: values?.name,
                  description: values?.description,
                  original_url: values?.category_image?.url,
                  isActive: state,
                  categoryId: categoryId
                };
                const respone = await handleUpdateCategory(result);
                console.log('respone', respone)
            } else if (formType === 'addProduct') {
              const result = {
                categoryId: values?.categoryId,
                productId: values?.productId,
              };
              const respone = await handleAddProductCategory(result);
              console.log('respone', respone)
            }
        }      
      }}
    >
      {({ setFieldValue, values, errors }) => {
        // Handle option change inside the Formik render props so setFieldValue is available
        const handleOptionChange = (event) => {
          const selectedValue = event.target.value;
          setFieldValue('lang', selectedValue);  // Set the 'lang' field value
          console.log('Selected Option:', selectedValue);
        };

        const handleOptionUpdateChange = (event) => {
          const langCode = event.target.value;
          setFieldValue('lang', langCode);
          const currentPathNoLang = currentPath.replace(/\.lang=[a-zA-Z-]+/, '');
          if (langCode == 'main') {
            router.push(`${currentPathNoLang}`);
          } else {
            router.push(`${currentPathNoLang}.lang=${langCode}`);
          }
        };

        const handleCategoryIdChange = (event) => {
          const selectedValue = event.target.value;
          setFieldValue('categoryId', selectedValue);  // Set the 'lang' field value
          console.log('Selected Option:', selectedValue);
        };

        const handleProductIdChange = (event) => {
          const selectedValue = event.target.value;
          setFieldValue('productId', selectedValue);  // Set the 'lang' field value
          console.log('Selected Option:', selectedValue);
        };

        return (
          <Form className="theme-form theme-form-2 mega-form">
            {formType === 'create' && (
              <Row className="align-items-center">
                <Col xs="12" md="12" lg="12">
                  <div className="title-header option-title">
                    <Input
                      type="select"
                      value={values.lang}
                      onChange={handleOptionChange}
                    >
                      <option value="" disabled>{t('Select a language')}</option>
                      <option value="vi">{t('Vietnamese')}</option>
                      <option value="en">{t('English')}</option>
                      <option value="ko">{t('Korean')}</option>
                      <option value="zh-CN">{t('Chinese')}</option>
                    </Input>
                  </div>
                </Col>
              </Row>
            )}

            {formType === 'update' && (
              <Row className="align-items-center">
                <Col xs="12" md="12" lg="12">
                  <div className="title-header option-title">
                    <Input
                      type="select"
                      value={langCode}
                      onChange={handleOptionUpdateChange}
                    >
                      <option value="" disabled>{t('Select a language')}</option>
                      <option value="main">{t('Category')}</option>
                      <option value="vi">{t('Vietnamese')}</option>
                      <option value="en">{t('English')}</option>
                      <option value="ko">{t('Korean')}</option>
                      <option value="zh-CN">{t('Chinese')}</option>
                    </Input>
                  </div>
                </Col>
              </Row>
            )}

            {formType === 'createSub' && (
              <Row className="align-items-center">
                <Col xs="12" md="8" lg="9">
                  <div className="title-header option-title">
                    <Input
                      type="select"
                      value={values.categoryId}
                      onChange={handleCategoryIdChange}
                    >
                      <option value="" disabled>{t('Select a category')}</option>
                      {categoryData?.map(category => (
                        <option key={category.categoryId} value={category.categoryId}>
                          {category.name}
                        </option>
                      ))}
                    </Input>
                  </div>
                </Col>
                <Col xs="12" md="4" lg="3">
                  <div className="title-header option-title">
                    <Input
                      type="select"
                      value={values.lang}
                      onChange={handleOptionChange}
                    >
                      <option value="" disabled>{t('Select a language')}</option>
                      <option value="vi">{t('Vietnamese')}</option>
                      <option value="en">{t('English')}</option>
                      <option value="ko">{t('Korean')}</option>
                      <option value="zh-CN">{t('Chinese')}</option>
                    </Input>
                  </div>
                </Col>
              </Row>
            )}
            {formType === 'update' && !langCode && (
            <Row className="align-items-center">
              <Col xs="12" md="2" lg="2">
                <p style={{ fontSize: '16px', fontWeight: 600, position: 'relative', paddingTop: 0 }}>Cho Phép</p>
              </Col>
              <Col xs="12" md="3" lg="3">
              <FormGroup switch className="ps-0 form-switch form-check">
                <Label className="switch switch-sm">
                  <Input
                    type="switch"
                    checked={values.isActive}
                    onClick={() => {
                      setState(!state);
                      setFieldValue('isActive', state);
                    }}
                  />
                  <span className={`switch-state`}></span>
                </Label>
              </FormGroup>
              </Col>
            </Row>
            )}

            {formType === 'addProduct' && (
              <Row className="align-items-center">
                <Col xs="12" md="6" lg="6">
                  <div className="title-header option-title">
                    <Input
                      type="select"
                      value={values.categoryId}
                      onChange={handleCategoryIdChange}
                    >
                      <option value="" disabled>{t('Select a category')}</option>
                      {categoryData?.map(category => (
                        <option key={category.categoryId} value={category.categoryId}>
                          {category.name}
                        </option>
                      ))}
                    </Input>
                  </div>
                </Col>
                <Col xs="12" md="6" lg="6">
                  <div className="title-header option-title">
                    <Input
                      type="select"
                      value={values.productId}
                      onChange={handleProductIdChange}
                    >
                      <option value="" disabled>{t('Select a product')}</option>
                      {productData?.map(product => (
                        <option key={product.productId} value={product.productId}>
                          {product.name}
                        </option>
                      ))}
                    </Input>
                  </div>
                </Col>
              </Row>
            )}

            <br></br>
            <Row>
            {formType !== 'addProduct' && (
              <SimpleInputField
                nameList={[
                  {
                    name: 'name',
                    title: 'Name',
                    placeholder: t('EnterCategoryName'),
                    require: 'true',
                  },
                  { name: 'description', placeholder: t('EnterCategoryDescription') },
                ]}
              />
            )}
            { (!langCode && (formType !== 'addProduct')) && (
              <FileUploadField
                name="category_image_id"
                id="category_image_id"
                title="Image"
                updateId={updateId}
                type="file"
                values={values}
                setFieldValue={setFieldValue}
              />
            )}
              <div className="ms-auto justify-content-end dflex-wgap mt-sm-4 mt-2 save-back-button">
              { formType == 'create' &&
                (
                  <>
                  <button className="btn-outline btn-lg" type="submit" name="testSubmit" onClick={() => setFieldValue('submitter', 'test')}>{t('Preview')}</button>
                  <button className="btn-outline btn-lg" type="submit" name="regularSubmit" onClick={() => setFieldValue('submitter', 'submit')}>{t('Submit')}</button>
                  </>
                )
              }

              { formType == 'update' &&
                (
                  <>
                  <button className="btn-outline btn-lg" type="submit" name="regularSubmit" onClick={() => setFieldValue('submitter', 'submit')}>{ langCode? t('SubmitTransalation') : t('SubmitUpdate') }</button>
                  </>
                )
              }

              { formType == 'createSub' &&    
                (
                  <button className="btn-outline btn-lg" type="submit" name="regularSubmit" onClick={() => setFieldValue('submitter', 'submit')}>{t('Submit')}</button>
                )
              }

              { formType == 'addProduct' &&    
                (
                  <button className="btn-outline btn-lg" type="submit" name="regularSubmit" onClick={() => setFieldValue('submitter', 'submit')}>{t('Submit')}</button>
                )
              }
              </div>
            </Row>
          </Form>
        )
      }}
    </Formik>
  )
}
export default CategoryForm
