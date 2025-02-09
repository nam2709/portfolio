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
import CitySelection from '@/Components/Account/Addresses/CitySelection'

// async function addAddress({ accessToken, values }) {
//   return await post({
//     apiName: 'kamarket',
//     path: '/address',
//     options: {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//       body: values,
//     },
//   }).response
// }

const AddAddressForm = ({
  mutate,
  type,
  editAddress,
  setEditAddress,
  modal,
  setModal,
}) => {
  // const { auth } = useContext(AccountContext)
  // const router = useRouter()
  useEffect(() => {
    modal !== 'edit' && setEditAddress && setEditAddress({})
  }, [modal])
  // const { data } = useQuery([CountryAPI], () => request({ url: CountryAPI }), {
  //   enabled: true,
  //   refetchOnWindowFocus: false,
  //   select: res =>
  //     res.data.map(country => ({
  //       id: country.id,
  //       name: country.name,
  //       state: country.state,
  //     })),
  // })

  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  return (
    <>
    <CitySelection setModal={setModal} editAddress={editAddress} setEditAddress={setEditAddress} />
    </>
  )
}

export default AddAddressForm
