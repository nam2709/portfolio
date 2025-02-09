import React, { useState, useEffect, useContext } from 'react'
import { FormGroup, Input, Label } from 'reactstrap'
import { RiQuestionLine } from 'react-icons/ri'
import { useTranslation } from '@/app/i18n/client'
import Btn from '../../Elements/Buttons/Btn'
import ShowModal from '../../Elements/Alerts&Modals/Modal'
import I18NextContext from '@/Helper/I18NextContext'
import { fetchAuthSession } from 'aws-amplify/auth'

async function reviewProduct({ vendorId, productId, status }) {
  console.log('status', status)
  const token = await fetchAuthSession()
    .then(session => session?.tokens?.idToken?.toString())
    .catch(error => null)

  if (!token) throw new Error('Unauthorized')

  let baseURL = ""
  if (status===1) {
    baseURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/disable-products`
  } else {
    baseURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/products`
  }

  return await fetch(baseURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      productId,
      vendorId,
    }),
  }).then(response => response.json())
}

async function reviewVendor({ vendorId, status }) {
  const token = await fetchAuthSession()
    .then(session => session?.tokens?.idToken?.toString())
    .catch(error => null)

  if (!token) throw new Error('Unauthorized')

  let baseURL = ""
  if (status==="APPROVED") {
    baseURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/disable-vendors/${vendorId}`
  } else {
    baseURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/vendors/${vendorId}`
  }

  return await fetch(baseURL, {  
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    // body: JSON.stringify({
    //   vendorId,
    // }),
  }).then(response => response.json())
}

async function reviewUser({ userId, status }) {
  const token = await fetchAuthSession()
    .then(session => session?.tokens?.idToken?.toString())
    .catch(error => null)

  if (!token) throw new Error('Unauthorized')

  let action = ""
  if (status===1) {
    action = `handleAdminDisableUser`
  } else {
    action = `handleAdminEnableUser`
  }

  return await fetch(`${process.env.API_URL}/admin/user`, {  
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      action: action,
      username: userId
    }),
  }).then(response => response.json())
}

const Status = ({ data, refetch, disabled, apiKey }) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const [status, setStatus] = useState(false)
  const [modal, setModal] = useState(false)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setStatus(Boolean(Number(apiKey ? data[apiKey] : data.status)))
  }, [data, disabled])

  console.log('data', data)

  const handleClick = async value => {
    console.log({ CONFIRM_STATUS: { data, apiKey, value } })
    if (apiKey === 'is_approved' && data?.productId && data?.vendorId) {
      console.log({ REVIEW_PRODUCT: { productId: data.productId, vendorId: data.vendorId } })
      setLoading(true)
      reviewProduct({ vendorId: data.vendorId, productId: data.productId, status: data.status })
        .then(data => {
          setStatus(value)
          refetch();
        })
        .catch(error => {
          console.error('Error reviewing product:', error.message)
        })
        .finally(() => {
          setLoading(false)
          setModal(false)
        })
    } else if (apiKey === 'is_approved' && data?.vendorId && !data?.productId) {
      console.log({ REVIEW_VENDOR: { vendorId: data.vendorId } })
      setLoading(true)
      reviewVendor({ vendorId: data.vendorId, status: data.status })
        .then(data => {
          setStatus(value)
          refetch();
        })
        .catch(error => {
          console.error('Error reviewing vendor:', error.message)
        })
        .finally(() => {
          setLoading(false)
          setModal(false)
        })
    } else if (data?.UserStatus) {
      console.log({ REVIEW_USER: { userId: data.Username || data.id, status: data.status } })
      setLoading(true)
      reviewUser({ userId: data.Username || data.id, status: data.status })
        .then(data => {
          setStatus(value)
          refetch();
        })
        .catch(error => {
          console.error('Error reviewing product:', error.message)
        })
        .finally(() => {
          setLoading(false)
          setModal(false)
        })
    }
  }

  return (
    <>
      <FormGroup switch className="ps-0 form-switch form-check">
        <Label className="switch switch-sm" onClick={() => !disabled && setModal(true)}>
          <Input type="switch" disabled={disabled ? disabled : false} checked={status} />
          <span className={`switch-state ${disabled ? 'disabled' : ''}`}></span>
        </Label>
      </FormGroup>
      <ShowModal
        open={modal}
        close={false}
        setModal={setModal}
        buttons={
          <>
            <Btn title="Nope" onClick={() => setModal(false)} className="btn--no btn-md fw-bold" />
            <Btn
              title="Yes"
              loading={loading}
              onClick={() => handleClick(!status)}
              className="btn-theme btn-md fw-bold"
            />
          </>
        }
      >
        <div className="remove-box">
          <RiQuestionLine className="icon-box wo-bg" />
          <h5 className="modal-title">{t('Confirmation')}</h5>
          <p>{t('Areyousureyouwanttoproceed?')} </p>
        </div>
      </ShowModal>
    </>
  )
}

export default Status
