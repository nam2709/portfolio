import { useContext, useEffect, useState } from 'react'
import { Form, Formik } from 'formik'
import { Input } from 'reactstrap'
import Cookies from 'js-cookie'
import I18NextContext from '@/Helper/I18NextContext'
import { ForgotPasswordSchema } from '@/Utils/Hooks/Auth/useForgotPassword'
import { useTranslation } from '@/app/i18n/client'
//import useOtpVerification from '@/Utils/Hooks/Auth/useOtpVerification'
import Btn from '@/Elements/Buttons/Btn'

const OTPVerificationForm = ({ onSubmit }) => {
  const cookies = Cookies.get('ue')
  const [otp, setOtp] = useState('')
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  //const { mutate: otpVerification } = useOtpVerification()
  const handleChange = e => {
    if (e.target.value.length <= 6 && !isNaN(Number(e.target.value))) {
      setOtp(e.target.value)
    }
  }
  useEffect(() => {
    otp && otp.length === 6 && onSubmit({ email: cookies, token: otp })
  }, [otp])

  return (
    <>
      <Formik
        initialValues={{
          email: '',
        }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={values => onSubmit({ ...values, email: cookies })}
      >
        {() => (
          <Form className="row g-2">
            <div className="log-in-title">
              <h3 className="text-content">{t('OtpDescription')}</h3>
              {/* <h5 className="text-content">{t('CodeSend') + ' '}</h5> */}
            </div>
            <div className="outer-otp w-100">
              <div className="inner-otp d-center">
                <Input
                  type="text"
                  className="no-background mb-5"
                  maxLength="6"
                  onChange={handleChange}
                  value={otp}
                />
              </div>
            </div>
            <Btn
              title={'Validate'}
              type="button"
              className="btn-animation mt-3 w-100"
            />
          </Form>
        )}
      </Formik>
    </>
  )
}

export default OTPVerificationForm
