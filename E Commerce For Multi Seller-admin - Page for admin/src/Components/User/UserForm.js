import React, { useContext, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Form, Formik } from 'formik'
import { Row } from 'reactstrap'
import FormBtn from '../../Elements/Buttons/FormBtn'
import request from '../../Utils/AxiosUtils'
import {
  emailSchema,
  nameSchema,
  passwordConfirmationSchema,
  passwordSchema,
  phoneSchema,
  YupObject,
} from '../../Utils/Validation/ValidationSchemas'
import Loader from '../CommonComponent/Loader'
import UserDetail1 from './UserDetail1'
import UserAddress from './UserAddress'
import UserPassword from './UserPassword'
import UserRole from './UserRole'
import { useRouter } from 'next/navigation'
import I18NextContext from '@/Helper/I18NextContext'
import { fetchAuthSession } from 'aws-amplify/auth'

const UserForm = ({ updateId, fixedRole, noRoleField, addAddress, type, setModal }) => {
  // const {
  //   data: rolesData,
  //   isLoading: roleLoading,
  //   refetch: RoleRefetch,
  // } = useQuery(['/role'], () => request({ url: '/role' }), {
  //   refetchOnMount: false,
  //   enabled: false,
  //   select: data => data?.data?.data?.filter(elem => elem.id !== 1 && elem.id !== 3),
  // })
  const {
    data: oldData,
    isLoading: oldDataLoading,
    refetch,
  } = useQuery(
    [updateId],
    async () => {
      const token = await fetchAuthSession()
        .then(session => session?.tokens?.idToken?.toString())
        .catch(error => null)
      return request({
        url: `${process.env.API_URL}/admin/user`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify({
          action: "handleAdminGetUser",
          username: updateId,
        }),
      })
    },
    {
      enabled: false, // Disabled by default, refetch manually
      refetchOnWindowFocus: false,
    }
  )

  useEffect(() => {
    if (updateId) {
      refetch()
    }
  }, [updateId])

  console.log("oldData", oldData)

  // useEffect(() => {
  //   RoleRefetch()
  // }, [])
  if (updateId && oldDataLoading) return <Loader />
  const attributes = oldData?.data?.data?.UserAttributes || [];
  const attributeMap = attributes.reduce((acc, item) => {
    acc[item.Name] = item.Value;
    return acc;
  }, {});
  
  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: attributeMap["name"] || '',
        email: attributeMap["email"] || '',
        email_verify: attributeMap["email_verified"] || '',
        phone: attributeMap["phone_number"] || '',
        phone_verify: attributeMap["phone_number_verified"] || '',
        vendor: oldData?.data?.data?.UserAttributes?.find(item => item.Name === "custom:vendorId") ? 'true' : 'false',
        password: '',
        password_confirmation: '',
        // role_id: updateId ? Number(oldData?.data?.role?.id) || '' : fixedRole ? 2 : '',
        status: updateId ? Boolean(Number(oldData?.data?.status)) : true,
        address: [],
        country_code: updateId ? oldData?.data?.country_code || '' : '91',
      }}
      validationSchema={YupObject({
        name: nameSchema,
        email: emailSchema,
        phone: nameSchema,
        password: !updateId && passwordSchema,
        password_confirmation: !updateId && passwordConfirmationSchema,
        role_id: noRoleField ? null : nameSchema,
      })}
      onSubmit={values => {
        // Put Add Or Update Logic Here
        router.push(`/${i18Lang}/user`)
      }}
    >
      {({ values }) => (
        <Form className="theme-form theme-form-2 mega-form">
          <Row>
            {!addAddress && (
              <>
                <UserDetail1 />
                <UserPassword updateId={updateId} />
                {/* {noRoleField ? '' : <UserRole rolesData={rolesData} />} */}
              </>
            )}
            <UserAddress addAddress={addAddress} type={type} />
            {/* <FormBtn /> */}
          </Row>
        </Form>
      )}
    </Formik>
  )
}

export default UserForm
