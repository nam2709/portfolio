import { useContext } from 'react'
import { RiQuestionLine } from 'react-icons/ri'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import Btn from '@/Elements/Buttons/Btn'
import CustomModal from './CustomModal'

const ConfirmationModalVendor = ({ modal, setModal, isLoading, textConfirm }) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  return (
    <CustomModal
      modal={modal}
      setModal={setModal}
      classes={{
        modalClass: 'theme-modal delete-modal',
        modalHeaderClass: 'p-0',
      }}
    >
      <RiQuestionLine className="icon-box wo-bg" />
      <h5 className="modal-title">{t('Confirmation')}</h5>
      <p>{textConfirm ? t(textConfirm) : t('AreYouSure')} </p>
      <div className="button-box">
        <Btn
          title="Confirmation"
          className="theme-bg-color btn-md fw-bold text-light"
          loading={Number(isLoading)}
          onClick={() => setModal('')}
        />
      </div>
    </CustomModal>
  )
}

export default ConfirmationModalVendor
