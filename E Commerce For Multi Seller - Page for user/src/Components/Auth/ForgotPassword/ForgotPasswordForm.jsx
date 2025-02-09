import { useContext } from 'react'
import { Form, Formik } from 'formik'
import FormBtn from '@/Components/Common/FormBtn'
import SimpleInputField from '@/Components/Common/InputFields/SimpleInputField'
import I18NextContext from '@/Helper/I18NextContext'
import useHandleForgotPassword, {
  ForgotPasswordSchemaStep1,
} from '@/Utils/Hooks/Auth/useForgotPassword'
import { useTranslation } from '@/app/i18n/client'

const ForgotPasswordForm = ({handleResetPassword}) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  // const { mutate, isLoading } = useHandleForgotPassword()

  return (
    <>
      <Formik
        initialValues={{
          email: '',
        }}
        validationSchema={ForgotPasswordSchemaStep1}
        onSubmit={handleResetPassword}
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
              ]}
            />
            <FormBtn
              title={'ForgotPassword'}
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

export default ForgotPasswordForm
