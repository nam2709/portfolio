import { Form, Formik } from 'formik'
import Link from 'next/link'
import { Col, Input, Label } from 'reactstrap'
import FormBtn from '@/Components/Common/FormBtn'
import SimpleInputField from '@/Components/Common/InputFields/SimpleInputField'
import { LogInSchema } from '@/Utils/Hooks/Auth/useLogin'
import { useContext, useEffect } from 'react'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'

const LoginForm = ({ onSubmit, loading }) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={LogInSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <Form className="row g-4">
          <SimpleInputField
            nameList={[
              {
                name: 'email',
                placeholder: t('EmailAddress'),
                title: 'Email',
                label: 'Email Address',
              },
              {
                name: 'password',
                placeholder: t('EnterPassword'),
                type: 'password',
                title: 'Password',
                label: 'Password',
              },
            ]}
          />

          <Col xs={12}>
            <div className="forgot-box">
              <div className="form-check remember-box">
                <Input
                  className="checkbox_animated check-box"
                  type="checkbox"
                  id="flexCheckDefault"
                />
                <Label className="form-check-label" htmlFor="flexCheckDefault">
                  {t('Rememberme')}
                </Label>
              </div>
              <Link
                href={`/${i18Lang}/auth/forgot-password`}
                className="forgot-password"
              >
                {t('ForgotPassword')}?
              </Link>
            </div>
          </Col>
          <FormBtn
            title={'LogIn'}
            classes={{ btnClass: 'btn btn-animation w-100' }}
            loading={loading}
          />
        </Form>
      )}
    </Formik>
  )
}

export default LoginForm
