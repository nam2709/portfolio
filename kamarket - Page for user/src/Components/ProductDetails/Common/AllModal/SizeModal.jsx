import CustomModal from '@/Components/Common/CustomModal'
import Image from 'next/image'

const SizeModal = ({ modal, setModal, productState }) => {
  console.log('1productState',productState)
  return (
    <CustomModal
      modal={modal ? true : false}
      setModal={setModal}
      classes={{ modalClass: 'theme-modal modal-lg', title: 'SizeCart' }}
    >
      <Image
        src={productState?.product?.size_chart_image?.original_url || productState?.product?.product_galleries[0].url}
        className="img-fluid"
        alt="size_chart_image"
        height={312}
        width={768}
      />
    </CustomModal>
  )
}

export default SizeModal
