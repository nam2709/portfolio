import { useContext, useEffect, useState } from 'react'
import { Form, Formik } from 'formik'
import I18NextContext from '@/Helper/I18NextContext'
import { ForgotPasswordSchema } from '@/Utils/Hooks/Auth/useForgotPassword'
import { useTranslation } from '@/app/i18n/client'
//import useOtpVerification from '@/Utils/Hooks/Auth/useOtpVerification'
import SimpleInputField from '@/Components/Common/InputFields/SimpleInputField'
// import FormBtn from '@/Components/Common/FormBtn'
import Btn from '@/Elements/Buttons/Btn'
import FormBtn from '@/Components/Common/FormBtn'

const OTPVerificationFormForgot = ({ handleConfirmPassword }) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  return (
    <>
      <Formik
        initialValues={{
          code: '',
          password: '',
          password_confirmation: '',
        }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={handleConfirmPassword}
      >
        {() => (
          <Form className="row g-4">
            <SimpleInputField
              nameList={[
                {
                  name: 'code',
                  placeholder: t('EmailAddress'),
                  title: 'Code',
                  label: 'Code',
                  // type: 'number',
                },
                {
                  name: 'password',
                  placeholder: t('Password'),
                  type: 'password',
                  title: 'Password',
                  label: 'Password',
                },
                {
                  name: 'password_confirmation',
                  placeholder: t('EnterConfirmPassword'),
                  type: 'password',
                  title: 'ConfirmPassword',
                  label: 'Confirm Password',
                },
              ]}
            />
            <FormBtn
              title={'Submit'}
              classes={{
                btnClass: 'btn-animation w-100 justify-content-center',
              }}
            />
          </Form>
        )}
      </Formik>
    </>
  )
}

export default OTPVerificationFormForgot
