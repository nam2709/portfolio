import React, { useContext } from 'react'
import SimpleInputField from '../InputFields/SimpleInputField'
import SearchableSelectInput from '../InputFields/SearchableSelectInput'
import { AllCountryCode } from '../../Data/AllCountryCode'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'

const UserDetail1 = () => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  return (
    <>
      <SimpleInputField
        nameList={[
          { name: 'name', require: 'true' },
          { type: 'email', name: 'email', require: 'true' },
          { type: 'email_verify', name: 'email_verify', require: 'true' },
          { name: 'phone', type: 'phone', require: 'true' },
          { type: 'phone_verify', name: 'phone_verify', require: 'true' },
          { type: 'vendor', name: 'vendor', require: 'true' },
        ]}
      />
      {/* <div className="country-input mb-4">
        <SimpleInputField
          nameList={[
            { name: 'phone', type: 'number', placeholder: t('EnterPhoneNumber'), require: 'true' },
          ]}
        />
        <SearchableSelectInput
          nameList={[
            {
              name: 'country_code',
              notitle: 'true',
              inputprops: {
                name: 'country_code',
                id: 'country_code',
                options: AllCountryCode,
              },
            },
          ]}
        />
      </div> */}
    </>
  )
}

export default UserDetail1
