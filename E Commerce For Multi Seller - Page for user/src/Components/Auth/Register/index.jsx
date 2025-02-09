'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Col, Button } from 'reactstrap'
// import Breadcrumb from '@/Components/Common/Breadcrumb'
import WrapperComponent from '@/Components/Common/WrapperComponent'
import signUpImage from '../../../../public/assets/images/inner-page/sign-up.png'
import { useContext } from 'react'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import RegisterForm from './RegisterForm'
import AuthHeadings from '../Common/AuthHeadings'
import Cookies from 'js-cookie'
import { signUp, confirmSignUp, signInWithRedirect, signIn } from 'aws-amplify/auth'
import OTPVerificationForm from '../OTPVerfication/OTPVerificationForm'
import AccountContext from '@/Helper/AccountContext'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { ToastNotification } from '@/Utils/CustomFunctions/ToastNotification'

const RegisterContent = () => {
  const { i18Lang } = useContext(I18NextContext)
  const { login, auth, searchParams } = useContext(AccountContext)
  const { t } = useTranslation(i18Lang, 'common')
  const [nextStep, setNextStep] = useState(null)
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    if (auth?.username && !auth?.loading) {
      if (searchParams) {
        router.push(searchParams)
      } else router.push(`/${i18Lang}`)
    }
  }, [auth?.username, auth?.loading])

  // const handleSignInWithGoogle = async () => {
  //   signInWithRedirect({
  //     provider: 'Google',
  //   })
  //     .then(data => {
  //       console.log('Google Signed In', data)
  //     })
  //     .catch(error => {
  //       console.error('Google Sign In - Failed', error)
  //     })
  // }

  const handleSignUpWithEmail = async values => {
    try {
      Cookies.set('ue', values.email)
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: values.email,
        password: values.password,
        options: {
          userAttributes: {
            email: values.email,
            name: values.name// E.164 number convention
          },
        },
      })
      if (!isSignUpComplete && nextStep) {
        setNextStep(nextStep)
        setUsername(values.email)
        setPassword(values.password)
      }
    } catch (error) {
      if (error.message === 'User already exists') {
        ToastNotification('warn', 'User already exists')
      }
    }
    // Add your logic here
  }

  const handleConfirmSignUp = async values => {
    confirmSignUp({
      username: values.email || Cookies.get('ue'),
      confirmationCode: values.token,
    })
      .then(data => {
        if(data.isSignUpComplete === true){
          login({ username: username, password: password })
        }
      })
      .catch(error => {
        console.error(error)
      })
      .finally(() => {
        console.log('CONFIRMED SIGN UP')
      })
  }

  return (
    <>
      {/* <Breadcrumb title={'Register'} subNavigation={[{ name: 'Register' }]} /> */}
      <WrapperComponent
        classes={{
          sectionClass: 'log-in-section section-b-space',
          fluidClass: 'w-100',
        }}
        customCol={true}
      >
        <Col xxl={6} xl={5} lg={6} className="d-lg-block d-none ms-auto">
          <div className="image-contain">
            <Image
              src={signUpImage}
              className="img-fluid"
              alt="sign-up"
              height={465}
              width={550}
            />
          </div>
        </Col>

        <Col xxl={4} xl={5} lg={6} sm={8} className="mx-auto">
          <div className="log-in-box">
          {!nextStep && <AuthHeadings
              heading1={'WelcomeToKamarket'}
              heading2={'CreateNewAccount'}
            />}

            <div className="input-box">
              {!nextStep ? (
                <RegisterForm onSubmit={handleSignUpWithEmail} />
              ) : (
                <OTPVerificationForm onSubmit={handleConfirmSignUp} />
              )}
            </div>

            <div className="other-log-in">
              <h6>{t('or')}</h6>
            </div>

            {/* <div className="sign-up-box">
              <h4>{t('Alreadyhaveanaccount')}?</h4>
              <Button onClick={handleSignInWithGoogle}>
                Sign In With Google
              </Button>
            </div> */}

            <div className="sign-up-box">
              <h4>{t('Alreadyhaveanaccount')} <Link href={`/${i18Lang}/auth/login`}>{t('Login')}</Link></h4>
              
            </div>
          </div>
        </Col>
      </WrapperComponent>
    </>
  )
}

export default RegisterContent
