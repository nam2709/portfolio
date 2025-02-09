'use client'
import React, { useContext, useState } from 'react'
import { Alert, Col, Spinner } from 'reactstrap'
import { Field, Form, Formik } from 'formik'
import Link from 'next/link'
import LoginBoxWrapper from '@/Utils/HOC/LoginBoxWrapper'
import { LogInSchema } from '@/Utils/Hooks/Auth/useLogin'
import Btn from '@/Elements/Buttons/Btn'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import { ReactstrapInput } from '@/Components/ReactstrapFormik'
import { useRouter } from 'next/navigation'
import { signIn } from 'aws-amplify/auth'
import { fetchAuthSession } from 'aws-amplify/auth'
import { isVendor } from '@/Utils/libs'

const Login = ({ params }) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const router = useRouter()
  const [error, setError] = useState(null)

  const handleLogin = async values => {
    try {
      await signIn({ username: values.email, password: values.password })
      const session = await fetchAuthSession()
      if (!isVendor(session)) {
        if (session?.tokens) {
          await signOut() //.catch(error => console.error('Error while sign out', error.message))
          throw new Error('User is not a vendor')
        }
      } else router.push(`/${params.lng}/dashboard`)
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="box-wrapper">
      <LoginBoxWrapper>
        <div className="log-in-title">
          <h3>{t('WelcomeToFastkart')}</h3>
          <h4>{t('LogInYourAccount')}</h4>
        </div>
        <div className="input-box">
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={LogInSchema}
            onSubmit={async values => await handleLogin(values)}
          >
            {({ isSubmitting }) => (
              <Form className="row g-2">
                <Col sm="12">
                  <Field
                    name="email"
                    type="email"
                    component={ReactstrapInput}
                    className="form-control"
                    id="email"
                    placeholder="Email Address"
                    label="EmailAddress"
                  />
                </Col>
                <Col sm="12">
                  <Field
                    name="password"
                    component={ReactstrapInput}
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    label="Password"
                  />
                </Col>
                {error && <Alert color="danger">{error}</Alert>}
                <Col sm="12">
                  <div className="forgot-box">
                    <Link href={`/${i18Lang}/auth/forgot-password`} className="forgot-password">
                      {t('ForgotPassword')}?
                    </Link>
                  </div>
                </Col>
                <Col sm="12">
                  <Btn
                    title="Login"
                    className="btn btn-animation w-100 justify-content-center"
                    type="submit"
                    color="false"
                    loading={isSubmitting}
                  />

                  <div className="sign-up-box">
                    <h4>{"Don't Have Seller Account?"}</h4>
                    <Link href={`/${i18Lang}/auth/register`}>{'Sign Up'}</Link>
                  </div>
                </Col>
              </Form>
            )}
          </Formik>
        </div>
      </LoginBoxWrapper>
    </div>
  )
}

export default Login
