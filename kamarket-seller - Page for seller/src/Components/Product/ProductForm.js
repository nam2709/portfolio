import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from '@/app/i18n/client'
import { useQuery } from '@tanstack/react-query'
import { Form, Formik } from 'formik'
import { Row, Col, Card } from 'reactstrap'
import { ProductTabTitleListData } from '../../Data/TabTitleListData'
import FormBtn from '../../Elements/Buttons/FormBtn'
import request from '../../Utils/AxiosUtils'
import { productUpdate } from '../../Utils/AxiosUtils/API'
import { YupObject, nameSchema } from '../../Utils/Validation/ValidationSchemas'
import Loader from '../CommonComponent/Loader'
import TabTitle from '../Coupon/TabTitle'
import { ProductInitValues, ProductValidationSchema } from './ProductObjects'
import SettingContext from '../../Helper/SettingContext'
import AllProductTabs from './AllProductTabs'
import I18NextContext from '@/Helper/I18NextContext'
import { useRouter } from 'next/navigation'
import { fetchAuthSession } from 'aws-amplify/auth'
import ProductSubmitFunction from './ProductSubmitFunction'
import { ToastNotification } from '@/Utils/CustomFunctions/ToastNotification'

const ProductForm = ({ setResetKey, updateId, title }) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('1')
  const { state } = useContext(SettingContext)
  const {
    data: oldData,
    isLoading: oldDataLoading,
    refetch,
    status,
  } = useQuery([updateId], () => request({ url: `${productUpdate}/${updateId}` }), {
    refetchOnWindowFocus: false,
    enabled: false,
    select: data => data.data,
  })
  useEffect(() => {
    if (updateId) {
      refetch()
    }
  }, [updateId])

  const watchEvent = useCallback(
    (oldData, updateId) => {
      return ProductInitValues(oldData, updateId)
    },
    [oldData, updateId]
  )

  if (updateId && oldDataLoading) return <Loader />
  return (
    <Formik
      initialValues={{ ...watchEvent(oldData, updateId) }}
      // validationSchema={YupObject({
      //   ...ProductValidationSchema,
      // })}
      onSubmit={async values => {
        console.log('valuesssssss', values)
        if (updateId) {
          values['_method'] = 'put'
          ProductSubmitFunction(null, values, updateId, setResetKey)
          ToastNotification('success', t('UpdateSuccess'))
          // setResetKey(true)
          router.push(`/${i18Lang}/product`)
        } else {
          const token = await fetchAuthSession().catch(console.error)
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token?.tokens?.idToken?.toString()}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          })
            .then(res => ToastNotification('success', t('AddSuccess')))
            .catch(error => {
              console.error(error.message)
              throw error
            })
          // ProductSubmitFunction(null, values, updateId);
          setResetKey(true)
          router.push(`/${i18Lang}/product`)
        }
      }}
    >
      {({ values, setFieldValue, errors, touched }) => (
        <Form className="theme-form theme-form-2 mega-form vertical-tabs">
          <Row>
            <Col>
              <Card>
                <div className="title-header option-title">
                  <h5>{t(title)}</h5>
                </div>
                <Row>
                  <Col xl="3" lg="4">
                    <TabTitle
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      titleList={ProductTabTitleListData}
                      errors={errors}
                      touched={touched}
                    />
                  </Col>
                  <AllProductTabs
                    values={values}
                    activeTab={activeTab}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    updateId={updateId}
                  />
                  <FormBtn />
                </Row>
              </Card>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  )
}

export default ProductForm
