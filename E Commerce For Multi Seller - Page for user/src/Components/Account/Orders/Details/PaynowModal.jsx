import { useContext } from 'react'
import { Col, Input, Label, Row } from 'reactstrap'
import CustomModal from '@/Components/Common/CustomModal'
import SettingContext from '@/Helper/SettingContext'
import { ModifyString } from '@/Utils/CustomFunctions/ModifyString'
import Btn from '@/Elements/Buttons/Btn'
import { ErrorMessage, Form, Formik } from 'formik'
import { YupObject, nameSchema } from '@/Utils/Validation/ValidationSchemas'
import { handleModifier } from '@/Utils/Validation/ModifiedErrorMessage'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import { fetchAuthSession } from 'aws-amplify/auth'

const PaynowModal = ({ modal, setModal, params, data }) => {
  console.log("data", data)
  const { settingData } = useContext(SettingContext)
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')

  const getAmount = async (payment) => {
    const baseUrl = `${process.env.NEXT_PUBLIC_PAYMENT_API}/payment/${payment?.PaymentId}`
    const response = await fetch(baseUrl);
    const data = await response.json();
    return data?.amount?.amount || data?.amount
  }

  const getPayment = async (order) => {
    const baseUrl = `${process.env.NEXT_PUBLIC_PAYMENT_API}/payment-order/${order?.orderId[0]}`
    const response = await fetch(baseUrl);
    const data = await response.json();
    const amount = await getAmount(data)
    return {...data, amount: amount}
  }

  const handleCheckoutZaloPay = async (order) => {
    const token = await fetchAuthSession()
        .then(session => session?.tokens?.idToken?.toString())
        .catch(error => {
          console.error('ERROR GET TOKEN', error.message)
          return null
        })

    const payment = await getPayment(order)
    console.log('getPayment', payment)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PAYMENT_API}/payments/zalo-pay`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payment)
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
  }

  return (
    <CustomModal
      modal={modal}
      setModal={setModal}
      classes={{
        modalClass: 'theme-modal',
        modalBodyClass: 'address-form',
        title: `PayNow`,
      }}
    >
      <Formik
        initialValues={{ payment_method: '', total: data?.total, orderId: [params], userId: data?.userId }}
        validationSchema={YupObject({
          payment_method: nameSchema,
        })}
        onSubmit={ async values => {
          // Add your logic here
          console.log('values', values)
          if (values?.payment_method !== 'COD') {
            const data = await handleCheckoutZaloPay(values);
            const order_url = data?.order_url;
            const orderIndex = order_url?.indexOf('order=') + 6;
    
            if (orderIndex > 5) {
                const order_payment = order_url.substring(orderIndex);
                const baseUrls = {
                  'TRANSFER_PAYMENTS': 'https://qcgateway.zalopay.vn/pay/v2/qr',
                  'CARD_PAYMENTS': 'https://qcgateway.zalopay.vn/pay/v2/atm-one-form',
                  'CREDIT_PAYMENTS': 'https://qcgateway.zalopay.vn/pay/v2/cc'
                };
    
                const url = baseUrls[values?.payment_method];
                if (url) {
                    window.open(`${url}?order=${order_payment}`, '_blank');
                }
            }
          }
          setModal(false)
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div className="checkout-box">
              <div className="checkout-detail">
                <Row className="g-3">
                  {settingData?.payment_methods?.map((payment, i) => (
                    <Col md={6} key={i}>
                      <div className="payment-option">
                        <div className="payment-category w-100">
                          <div className="form-check">
                            <Input
                              className="form-check-input"
                              type="radio"
                              name="payment_method"
                              value={payment.name}
                              id={payment.name}
                              onChange={() =>
                                setFieldValue('payment_method', payment.select)
                              }
                            />
                            <Label
                              className="form-check-label"
                              htmlFor={payment.name}
                            >
                              {ModifyString(t(payment.name), 'upper')}
                            </Label>
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
            <ErrorMessage
              name={'payment_method'}
              render={msg => (
                <div className="invalid-feedback d-block">
                  {handleModifier(msg)}
                </div>
              )}
            />
            <div className="modal-footer">
              <Btn
                title="Cancel"
                className="btn-md btn-theme-outline fw-bold"
                onClick={() => setModal(false)}
              />
              <Btn
                title="Submit"
                type="submit"
                className="btn-md fw-bold text-light theme-bg-color"
              />
            </div>
          </Form>
        )}
      </Formik>
    </CustomModal>
  )
}

export default PaynowModal
