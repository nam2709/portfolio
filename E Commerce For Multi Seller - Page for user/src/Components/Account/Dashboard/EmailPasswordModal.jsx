import { fetchUserAttributes, updatePassword } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation'
import { Form, Formik } from 'formik'
import { put } from 'aws-amplify/api'
import { useContext } from 'react'
import { updateUserAttributes } from 'aws-amplify/auth'
import { useSWRConfig } from 'swr'

import CustomModal from '@/Components/Common/CustomModal'
// import AccountContext from '@/Helper/AccountContext'
import {
  YupObject,
  nameSchema,
  passwordConfirmationSchema,
  passwordSchema,
} from '@/Utils/Validation/ValidationSchemas'
// import EmailPasswordForm from './EmailPasswordForm'
import UpdatePasswordForm from './UpdatePasswordForm'

// import { updateProfile } from '@/app/actions/account'

import AccountContext from '@/Helper/AccountContext'
import { toast } from 'react-toastify'
import { ToastNotification } from '@/Utils/CustomFunctions/ToastNotification'
import EmailPasswordForm from './EmailPasswordForm'

async function updateUserProfile({ token, data }) {
  try {
    const res = put({
      apiName: 'kamarket',
      path: '/me',
      options: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      },
    })
    const { body } = await res.response
    const json = await body.json()
    return json
  } catch (error) {
    return {}
  }
}

async function handleUpdatePassword({ oldPassword, newPassword }) {
  return updatePassword({ oldPassword, newPassword })
}

const EmailPasswordModal = ({ modal, setModal, profile }) => {
  // const { accountData, setAccountData } = useContext(AccountContext)
  const { auth } = useContext(AccountContext)
  const router = useRouter()
  const { mutate } = useSWRConfig()

  // async function updateProfile(data) {}

  // const EmailPasswordModal = ({ modal, setModal, onSubmit }) => {

  return (
    <>
      <CustomModal
        modal={modal == 'email' || modal == 'password' ? true : false}
        setModal={setModal}
        classes={{
          modalClass: 'theme-modal',
          modalBodyClass: 'address-form',
          title: `${modal == 'email' ? 'Edit Profile' : 'ChangePassword'}`,
        }}
      >
        <Formik
          initialValues={{
            current_password: '',
            password: '',
            password_confirmation: '',
          }}
          validationSchema={YupObject({
            current_password: modal == 'password' && nameSchema,
            password: modal == 'password' && passwordSchema,
            password_confirmation:
              modal == 'password' && passwordConfirmationSchema,
          })}
          onSubmit={async values => {
            if (modal == 'password') {
              // Add Update password here
              const updated = await handleUpdatePassword({
                oldPassword: values['current_password'] || undefined,
                newPassword: values['password'] || undefined,
              })
              setModal('')
            } else {
              // Add Update profile here
              console.log('UPDATING PROFILE', values)
              const updatedProfile = await updateUserAttributes({
                userAttributes: {
                  name: values?.name ? values.name : undefined,
                  // email: values?.email ? values.email : undefined,
                  phone_number: values?.phone ? `+${values.country_code}${values?.phone}` : undefined,
                  profile: values?.profile ? values.profile : undefined,
                },
              }).then(async () => await fetchUserAttributes())
              ToastNotification(
                'success',
                'Your password has been changed successfully. Use your new password to log in.'
              )
              mutate('/me', updatedProfile)
              setModal('')
            }
          }}
        >
          {formik => (
            <Form>
              {modal == 'email' && <EmailPasswordForm setModal={setModal} formik={formik} profile={profile}/>}
              {modal == 'password' && (
                <UpdatePasswordForm setModal={setModal} />
              )}
            </Form>
          )}
        </Formik>
      </CustomModal>
    </>
  )
}

export default EmailPasswordModal
