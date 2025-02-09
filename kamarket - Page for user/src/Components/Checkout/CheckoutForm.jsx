import { Form, Formik } from 'formik'
import { Col, Row } from 'reactstrap'
import DeliveryAddress from './DeliveryAddress'
import DeliveryOptions from './DeliveryOptions'
import PaymentOptions from './PaymentOptions'
import { useContext, useEffect, useState } from 'react'
import AccountContext from '@/Helper/AccountContext'
import CheckoutSidebar from './CheckoutSidebar'
import useSWR from 'swr'
import { fetchAuthSession } from 'aws-amplify/auth'
import { getHostApi } from '@/Utils/AxiosUtils'
import { YupObject, nameSchema } from '@/Utils/Validation/ValidationSchemas'

async function fetchAddresses() {
  const token = await fetchAuthSession()
    .then(session => session?.tokens?.idToken?.toString())
    .catch(() => null)

  return fetch(`${getHostApi()}address`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.json())
  // .catch(error => {
  //   console.error('FAILED to get addresses', error)
  //   return []
  // })
}

const CheckoutForm = () => {
  const { accountData, refetch } = useContext(AccountContext)
  const [address, setAddress] = useState([])
  const [modal, setModal] = useState('')
  useEffect(() => {
    accountData?.address.length > 0 && setAddress(prev => [...accountData?.address])
  }, [accountData])
  const addAddress = () => {
    //TODO: Add address API CALL here
    // console.log('')
    setModal('')
  }

  const { data, error, isLoading, mutate } = useSWR(`/address`, fetchAddresses)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error...{error}</div>
  return (
    <Formik 
    initialValues={{
      delivery_description: '',
      payment_method: '',
      ship_detail: {total: 0},
      coupon_detail: '',
      shipping_address: '',
      total_web_amount: '',
    }}
    validationSchema={YupObject({
      delivery_description: nameSchema,
      payment_method: nameSchema,
      ship_detail: nameSchema,
      coupon_detail: nameSchema,
      shipping_address: nameSchema,
      total_web_amount: nameSchema,
    })}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <div className="pb-4 checkout-section-2">
            <Row className="g-sm-4 g-3">
              <Col xxl="8" xl="7">
                <div className="left-sidebar-checkout">
                  <div className="checkout-detail-box">
                    <ul>
                      <DeliveryAddress
                        key="shipping"
                        type="shipping"
                        title={'Địa chỉ giao hàng'}
                        values={values}
                        updateId={values['consumer_id']}
                        setFieldValue={setFieldValue}
                        address={data}
                        modal={modal}
                        mutate={addAddress}
                        setModal={setModal}
                      />
                      {/* <DeliveryAddress key='billing' type='billing' title={'Billing'} values={values} updateId={values['consumer_id']} setFieldValue={setFieldValue} address={address} modal={modal} mutate={addAddress} setModal={setModal}
                      /> */}
                      <DeliveryOptions values={values} setFieldValue={setFieldValue} />
                      <PaymentOptions values={values} setFieldValue={setFieldValue} />
                    </ul>
                  </div>
                </div>
              </Col>
              <CheckoutSidebar values={values} setFieldValue={setFieldValue} addressData={data}/>
            </Row>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default CheckoutForm
