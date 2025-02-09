import ConfirmDeleteModal from '@/Components/Common/ConfirmDeleteModal'
import Btn from '@/Elements/Buttons/Btn'
import { useContext, useState } from 'react'
import { RiDeleteBinLine, RiEditBoxLine } from 'react-icons/ri'
import { Col, Row } from 'reactstrap'
import AddressTable from './AddressTable'
import AccountContext from '@/Helper/AccountContext'
import { useRouter } from 'next/navigation'
import { remove } from 'lodash'
import Cookies from 'js-cookie'
import { fetchAuthSession } from 'aws-amplify/auth'
import { getHostApi } from '@/Utils/AxiosUtils'

const AddressData = ({
  addressState,
  setAddressState,
  modal,
  setModal,
  setEditAddress,
  mutate,
}) => {
  const [deleteId, setDeleteId] = useState('')
  // const { auth } = useContext(AccountContext)
  // const router = useRouter()

  const removeAddress = async () => {
    const token = await fetchAuthSession()
      .then(session => session?.tokens?.idToken?.toString())
      .catch(() => null)
    // Add remove address login here
    //TODO: Remove address. Move to server actions deleteAddress(addressId)
    fetch(`${getHostApi()}address/${deleteId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) {
          console.error('Error Deleting Address', res)
          throw new Error('Error Deleting Address', res.statusText)
        }

        return res.json()
      })
      .then(data => {
        const updatedAddress = addressState.filter(e => e.id !== deleteId)
        mutate(updatedAddress)
      })
      .catch(error => {
        console.error('Error Deleting Address', error.message)
      })
      .finally(() => {
        setModal('')
        // router.replace(router.asPath)
      })
    // setAddressState(prev => prev.filter(elem => elem.id !== deleteId))

    // Refresh the page
  }
  return (
    <Row className="g-sm-4 g-3">
      {addressState?.map(address => (
        <Col xxl={4} xl={6} lg={12} md={6} key={address.addressId}>
          <div className="address-box">
            <AddressTable address={address} />
            <div className="button-group">
              <Btn
                className="btn-sm add-button"
                title={'Edit'}
                onClick={() => {
                  setEditAddress(address)
                  setModal('edit')
                }}
              >
                <RiEditBoxLine />
              </Btn>
              <Btn
                className="btn-sm add-button"
                title={'Remove'}
                onClick={() => {
                  setDeleteId(address?.addressId)
                  setModal('remove')
                }}
              >
                <RiDeleteBinLine />
              </Btn>
            </div>
          </div>
        </Col>
      ))}
      <ConfirmDeleteModal
        modal={modal == 'remove'}
        setModal={setModal}
        confirmFunction={removeAddress}
        setDeleteId={setDeleteId}
      />
    </Row>
  )
}

export default AddressData
