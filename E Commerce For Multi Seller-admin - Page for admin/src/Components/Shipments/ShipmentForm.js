import { React, useContext }  from 'react'
import { YupObject, nameSchema } from '@/Utils/Validation/ValidationSchemas'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap'
import { Form, Formik } from 'formik'
import SimpleInputField from '../InputFields/SimpleInputField'
import FileUploadField from '../InputFields/FileUploadField'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import { fetchAuthSession } from "aws-amplify/auth"
import { getHostApi } from '@/Utils/AxiosUtils'
import { ToastNotification } from '@/Utils/CustomFunctions/ToastNotification'

const ShipmentForm = ({ orderId, modal, setModal }) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  if (!modal) return null;

  const fetchOrderData = async () => {
    try {
      const res = await fetch(`${getHostApi()}order/${orderId}`, { method: 'GET' });
      if (!res.ok) throw new Error(`Error fetching order data: ${res.statusText}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const handleViettelPost = async () => {
    const token = await fetchAuthSession()
      .then(session => session?.tokens?.idToken?.toString())
      .catch(() => null)

    if (!token) throw new Error('Unauthorized')
    try {
        const data = await fetchOrderData()
        console.log('order data', data)
        const res = await fetch(`${process.env.NEXT_PUBLIC_SHIP_API}/ship/viettelpost`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error(`Error fetching order data: ${res.statusText}`);
        const respone = await res.json();
        console.log('data', respone)
        ToastNotification('success', 'Success Create Ship')
        window.open('https://viettelpost.vn/quan-ly-van-don', '_blank'); 
      } catch (error) {
        console.error(error);
      }
  }

  const toggle = () => setModal(!modal);

  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} size='xl'>
        <ModalHeader toggle={toggle}>Đơn vị vận chuyển</ModalHeader>
        <ModalBody>
            Viettel Post
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>{' '}
          <Button color="primary" onClick={handleViettelPost}>
            Submit
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ShipmentForm;
