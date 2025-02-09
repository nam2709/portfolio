import useSWR from 'swr'
import { RiAddLine } from 'react-icons/ri'
import { useContext, useState } from 'react'
import { fetchAuthSession } from 'aws-amplify/auth'

import Btn from '@/Elements/Buttons/Btn'
// import AccountContext from '@/Helper/AccountContext'
import CustomModal from '@/Components/Common/CustomModal'
import AddAddressForm from '@/Components/Checkout/common/AddAddressForm'
import AddressData from './AddressData'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import { getHostApi } from '@/Utils/AxiosUtils'

async function fetchAddresses() {
  const token = await fetchAuthSession()
    .then(session => session?.tokens?.idToken?.toString())
    .catch(() => null)

  return fetch(`${getHostApi()}address`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.json())
  // .catch(error => {
  //   console.error('FAILED to get addresses', error)
  //   return []
  // })
}

const AddressHeader = () => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const [addressState, setAddressState] = useState([])
  const [editAddress, setEditAddress] = useState()
  const [modal, setModal] = useState('')

  const { data, error, isLoading, mutate } = useSWR(`/address`, fetchAddresses)

  const addAddress = () => {
    setModal('')
  }
  const editMutate = () => {
    setModal('')
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error...{error}</div>

  // console.log('data addresses', data)
  // if (data.length === 0) {
  //   return <div>No Address</div>
  // }

  return (
    <>
      <div className="dashboard-address">
        <div className="title-header">
          <div className="d-flex align-items-center w-100 justify-content-between">
            <h5>{t('SavedAddress')}</h5>
            <Btn
              className="theme-bg-color text-white btn-sm fw-bold mt-lg-0 mt-3 ms-auto"
              onClick={() => setModal('add')}
              title={t('Add Address')}
            >
              <RiAddLine />
            </Btn>
          </div>
        </div>

        <AddressData
          addressState={data}
          setAddressState={setAddressState}
          modal={modal}
          setModal={setModal}
          setEditAddress={setEditAddress}
          mutate={mutate}
        />
      </div>
      <div className="checkout-detail">
        <CustomModal
          modal={modal == 'add' || modal == 'edit' ? true : false}
          setModal={setModal}
          classes={{
            modalClass: 'theme-modal view-modal address-modal modal-lg',
            modalHeaderClass: 'p-0',
          }}
        >
          <div className="right-sidebar-box">
            <AddAddressForm
              mutate={modal == 'add' ? addAddress : editMutate}
              setModal={setModal}
              setEditAddress={setEditAddress}
              editAddress={editAddress}
              modal={modal}
              setAddressState={setAddressState}
              update={mutate}
            />
          </div>
        </CustomModal>
      </div>
    </>
  )
}

export default AddressHeader
