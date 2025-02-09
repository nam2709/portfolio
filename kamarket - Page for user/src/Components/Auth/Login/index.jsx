'use client'
import { useContext, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Col, Alert } from 'reactstrap'
import WrapperComponent from '@/Components/Common/WrapperComponent'
import AuthHeadings from '../Common/AuthHeadings'
import loginImage from '../../../../public/assets/images/inner-page/log-in.png'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import LoginForm from './LoginForm'
import Breadcrumb from '@/Components/Common/Breadcrumb'
import OtpVerificationForm from '../OTPVerfication/OTPVerificationForm'
// import Cookies from 'js-cookie'
import AccountContext from '@/Helper/AccountContext'
import { useParams, useRouter } from 'next/navigation'

const LoginContent = () => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const router = useRouter()
  const params = useParams()
  const { login, auth, error, confirmSignUp, nextStep, searchParams } =
    useContext(AccountContext)

  useEffect(() => {
    if (auth?.username && !auth?.loading) {
      if (searchParams) {
        router.push(searchParams)
      } else router.push(`/${i18Lang}`)
    }
  }, [auth?.username, auth?.loading])

  const handleLoginWithEmail = async values => {
    await login({ username: values.email, password: values.password })
  }

  const handleConfirmSignUp = async values => {
    await confirmSignUp({
      username: values.email,
      token: values.token,
    })
  }

  return (
    <>
      <Breadcrumb title={'Login'} subNavigation={[{ name: 'Login' }]} />
      <WrapperComponent
        classes={{
          sectionClass: 'log-in-section background-image-2 section-b-space',
          fluidClass: 'w-100',
        }}
        customCol={true}
      >
        <Col xxl={6} xl={5} lg={6} className="d-lg-block d-none ms-auto">
          <div className="image-contain">
            <Image
              src={loginImage}
              className="img-fluid"
              alt="loginImage"
              height={465}
              width={550}
            />
          </div>
        </Col>

        <Col xxl={4} xl={5} lg={6} sm={8} className="mx-auto">
          <div className="log-in-box">
            <AuthHeadings
              heading1={'WelcomeToKamarket'}
              heading2={'LogInYourAccount'}
            />

            {auth?.error && <Alert color="danger">{auth?.error ? t('IncorrectUserNameOrPassword') : auth?.error}</Alert>}

            <div className="input-box">
              {!nextStep ? (
                <LoginForm
                  onSubmit={handleLoginWithEmail}
                  loading={auth?.loading}
                />
              ) : (
                <OtpVerificationForm
                  onSubmit={handleConfirmSignUp}
                  loading={auth?.loading}
                />
              )}
            </div>

            <div className="other-log-in">
              <h6>{t('or')}</h6>
            </div>

            <div className="sign-up-box">
              <h4>{t("Don'thaveanaccount")} <Link href={`/${i18Lang}/auth/register?redirect=${searchParams}`}>{t('SignUp')}</Link></h4>
            </div>
          </div>
        </Col>
      </WrapperComponent>
    </>
  )
}

export default LoginContent
