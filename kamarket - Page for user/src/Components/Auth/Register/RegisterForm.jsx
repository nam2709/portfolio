import { useContext } from 'react'
import { Form, Formik } from 'formik'
import { Col, Input, Label } from 'reactstrap'
import { useTranslation } from '@/app/i18n/client'
import I18NextContext from '@/Helper/I18NextContext'
import {
  YupObject,
  checkboxSchema,
  emailSchema,
  nameSchema,
  passwordConfirmationSchema,
  passwordSchema,
  phoneSchema,
} from '@/Utils/Validation/ValidationSchemas'
import FormBtn from '@/Components/Common/FormBtn'
import SimpleInputField from '@/Components/Common/InputFields/SimpleInputField'
// import { AllCountryCode } from '../../../../Data/AllCountryCode'
// import SearchableSelectInput from '@/Components/Common/InputFields/SearchableSelectInput'
// import { signUp } from 'aws-amplify/auth'

const RegisterForm = ({ onSubmit }) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        password: '',
        tandc: '',
        // password_confirmation: '',
        // country_code: '84',
        // phone: ''
      }}
      validationSchema={YupObject({
        name: nameSchema,
        email: emailSchema,
        password: passwordSchema,
        tandc: checkboxSchema,
        // password_confirmation: passwordConfirmationSchema,
        // phone: phoneSchema
      })}
      onSubmit={onSubmit}
    >
      {({ values }) => (
        <Form className="row g-md-4 g-3">
          <SimpleInputField
            nameList={[
              {
                name: 'name',
                placeholder: t('NameUser'),
                title: 'Name',
                label: 'FullName'
              },
              {
                name: 'email',
                placeholder: t('EmailAddress'),
                title: 'Email',
                label: 'EmailAddress',
              },
              {
                name: 'password',
                placeholder: t('Password'),
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
                  name="tandc"
                />
                <Label className="form-check-label" htmlFor="flexCheckDefault">
                  {t('Iagreewith')}
                  <span>{t('Terms')}</span> {t('and')}{' '}
                  <span>{t('Privacy')}</span>
                </Label>
              </div>
            </div>
          </Col>
          <FormBtn
            title={'SignUp'}
            classes={{ btnClass: 'btn btn-animation w-100' }}
          />
        </Form>
      )}
    </Formik>
  )
}

export default RegisterForm
