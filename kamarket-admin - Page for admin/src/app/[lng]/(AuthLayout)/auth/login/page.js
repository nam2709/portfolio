'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Alert, Col } from 'reactstrap'
import { Field, Form, Formik } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn, fetchAuthSession, signOut } from 'aws-amplify/auth'

import LoginBoxWrapper from '@/Utils/HOC/LoginBoxWrapper'
import { LogInSchema } from '@/Utils/Hooks/Auth/useLogin'
import Btn from '@/Elements/Buttons/Btn'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import { ReactstrapInput } from '@/Components/ReactstrapFormik'
import { isAdmin } from '@/Utils/libs'

const Login = ({ params }) => {
  // console.log({ params })
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  // const { loading, setLoading } = useState(null)
  const router = useRouter()
  const [error, setError] = useState(null)

  const [session, setSession] = useState(null)

  useEffect(() => {
    fetchAuthSession().then(setSession).catch(console.error)
  }, [])

  useEffect(() => {
    if (session) {
      if (isAdmin(session)) {
        console.log('Admin is already logged in. ')
        router.push(`/${params.lng}/dashboard`)
      } else {
        if (session?.tokens) {
          console.log('User is Not Admin. Log Out')
          signOut().then(console.log).catch(console.error)
        }
      }
    }
  }, [session])

  const handleLogin = async values => {
    // setLoading(true)
    console.log('LOGIN', values)
    try {
      await signIn({ username: values.email, password: values.password })
      const session = await fetchAuthSession().catch(console.error)
      console.log({ session })
      const token = session.tokens.idToken
      console.log({ payload: token?.payload })
      if (!token?.payload['cognito:groups']?.includes('Admin')) {
        console.log('User is Not Admin. Log Out')
        return await signOut()
      } else {
        console.log('User is Admin. Redirect to Dashboard')
        router.push(`/${params.lng}/dashboard`)
      }
      // router.push(`/${i18Lang}/dashboard`)
    } catch (error) {
      console.error(error)
    } finally {
      // setLoading(null)
    }
  }

  return (
    <div className="box-wrapper">
      <LoginBoxWrapper>
        <div className="log-in-title">
          <h3>{t('WelcomeToKamarket')}</h3>
          <h4>{t('LogInYourAccount')}</h4>
        </div>
        <div className="input-box">
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={LogInSchema}
            onSubmit={async values => {
              await handleLogin(values)
            }}
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
                <Col sm="12">
                  <div className="forgot-box">
                    <Link href={`/${i18Lang}/auth/forgot-password`} className="forgot-password">
                      {t('ForgotPassword')}?
                    </Link>
                  </div>
                </Col>
                {error && (
                  <Col sm="12">
                    <Alert color="danger">{error}</Alert>
                  </Col>
                )}
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
