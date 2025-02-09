'use client'
import { Col } from 'reactstrap'
import Image from 'next/image'
import Breadcrumb from '@/Components/Common/Breadcrumb'
import WrapperComponent from '@/Components/Common/WrapperComponent'
import ForgotPasswordForm from './ForgotPasswordForm'
import forgotPasswordImage from '../../../../public/assets/images/inner-page/forgot.png'
import AuthHeadings from '../Common/AuthHeadings'
import { resetPassword, confirmResetPassword  } from 'aws-amplify/auth';
import { useContext, useState } from 'react'
import OTPVerificationFormForgot from './OTPVerificationFormForgot'
import { useRouter } from 'next/navigation'
import I18NextContext from '@/Helper/I18NextContext'
import { ToastNotification } from '@/Utils/CustomFunctions/ToastNotification'

const ForgotPasswordContent = () => {
  const { i18Lang } = useContext(I18NextContext)
  const [step, setStep] = useState('1')
  const [name, setName] = useState('')
  const router = useRouter()

  const handleResetPassword = async values => {
    console.log(values)?.email
    const username = values?.email
    setName(values)
    try {
      const output = await resetPassword({username});
      handleResetPasswordNextSteps(output)
    } catch (error) {
      console.log(error);
    }
  }
  function handleResetPasswordNextSteps(output) {
    const { nextStep } = output;
    switch (nextStep.resetPasswordStep) {
      case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
        const codeDeliveryDetails = nextStep.codeDeliveryDetails;
        setStep('2')
        console.log(
          `Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`
        );
        break;
      case 'DONE':
        console.log('Successfully reset password.');
        break;
    }
  }

  const handleConfirmPassword = async values => {
    const username = name?.email
    const confirmationCode = values?.code
    const newPassword = values?.password
    console.log(username)
    try {
      await confirmResetPassword({ username, confirmationCode, newPassword })
      router.push(`/${i18Lang}/auth/login`)
      ToastNotification(
        'success',
        `Lấy lại mật khẩu thành công`
      )
    } catch (error) {
      console.log(error);
      ToastNotification(
        'error',
        `lấy lại mật khẩu không thành công`
      )
    }
    console.log(values)
  }
  return (
    <>
      <Breadcrumb
        title={'ForgotPassword'}
        subNavigation={[{ name: 'ForgotPassword' }]}
      />
      <WrapperComponent
        classes={{
          sectionClass: 'log-in-section section-b-space forgot-section',
          fluidClass: 'w-100',
        }}
        customCol={true}
      >
        <Col xxl={6} xl={5} lg={6} className="d-lg-block d-none ms-auto">
          <div className="image-contain">
            <Image
              src={forgotPasswordImage}
              className="img-fluid"
              alt="forgotPasswordImage"
            />
          </div>
        </Col>

        <Col xxl={4} xl={5} lg={6} sm={8} className="mx-auto">
          <div className="d-flex align-items-center justify-content-center h-100">
            <div className="log-in-box">
              <AuthHeadings
                heading1={'Forgotyourpassword'}
              />
              <div className="input-box">
                {step === '1' ? <ForgotPasswordForm  handleResetPassword={handleResetPassword}  /> : 
                  <OTPVerificationFormForgot  handleConfirmPassword={handleConfirmPassword}  />}
              </div>
            </div>
          </div>
        </Col>
      </WrapperComponent>
    </>
  )
}

export default ForgotPasswordContent
