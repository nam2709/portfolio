import { useContext, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Formik } from 'formik'
import I18NextContext from '@/Helper/I18NextContext'
import request from '@/Utils/AxiosUtils'
import { CountryAPI } from '@/Utils/AxiosUtils/API'
import {
  YupObject,
  nameSchema,
  phoneSchema,
} from '@/Utils/Validation/ValidationSchemas'
import { useTranslation } from '@/app/i18n/client'
import SelectForm from './SelectForm'
import { post } from 'aws-amplify/api'
import AccountContext from '@/Helper/AccountContext'
import { useRouter } from 'next/navigation'

async function addAddress({ accessToken, values }) {
  return await post({
    apiName: 'kamarket',
    path: '/address',
    options: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: values,
    },
  }).response
}

const FormikTheme = ({
  mutate,
  type,
  editAddress,
  setEditAddress,
  modal,
  setModal,
}) => {
  const { auth } = useContext(AccountContext)
  const router = useRouter()
  useEffect(() => {
    modal !== 'edit' && setEditAddress && setEditAddress({})
  }, [modal])
  const { data } = useQuery([CountryAPI], () => request({ url: CountryAPI }), {
    enabled: true,
    refetchOnWindowFocus: false,
    select: res =>
      res?.data?.map(country => ({
        id: country.id,
        name: country.name,
        state: country.state,
      })),
  })

  const handleAddAddress = values => {
    console.log('ADDING ADDRESS', values)
  }

  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  return (
    <Formik
      initialValues={{
        title: editAddress ? editAddress?.title : '',
        street: editAddress ? editAddress?.street : '',
        ward: editAddress ? editAddress?.ward : '',
        district: editAddress ? editAddress?.district : '',
        country_id: editAddress ? editAddress?.country_id : '704', // VIETNAM
        // state_id: editAddress ? editAddress?.state_id : '',
        city: editAddress ? editAddress?.city : '',
        // pincode: editAddress ? editAddress?.pincode : '',
        // phone: editAddress ? editAddress?.phone : '',
        // type: type ? type : null,
        country_code: editAddress ? editAddress?.country_code : '84', // VIETNAMESE CODE
      }}
      validationSchema={YupObject({
        // title: nameSchema,
        // street: nameSchema,
        // city: nameSchema,
        // country_id: nameSchema,
        // state_id: nameSchema,
        // pincode: nameSchema,
        // phone: phoneSchema,
      })}
      onSubmit={async values => {
        console.log('OnAddAddress', values)
        // if (modal) {
        //   values['_method'] = 'PUT'
        // }

        //TODO1: Add new address
        //TODO2: close modal
        //TODO3: refresh the page
        addAddress({
          accessToken: auth?.accessToken,
          values: {
            street: '125 Hai Bà Trưng',
            ward: 'Phường Bến Nghé',
            district: 'Quận 1',
            city: 'Hồ Chí Minh',
          },
        })
          .then(res => {
            console.log('ADDED ADDRESS', res)
            setModal(false)
            // refresh the page
            router.replace(router.asPath)
          })
          // .then(console.log)
          .catch(console.error)
      }}
    >
      {({ values, setFieldValue }) => (
        <SelectForm
          values={values}
          setFieldValue={setFieldValue}
          setModal={setModal}
          data={data}
          onSubmit={handleAddAddress}
        />
      )}
    </Formik>
  )
}

export default FormikTheme
