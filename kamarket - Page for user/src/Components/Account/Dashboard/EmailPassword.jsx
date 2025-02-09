import React, { useContext, useState } from 'react'
import { Table } from 'reactstrap'
import AccountContext from '@/Helper/AccountContext'
import EmailPasswordModal from './EmailPasswordModal'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import { updatePassword } from 'aws-amplify/auth'

const EmailPassword = ({ profile }) => {
  const [modal, setModal] = useState('')
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const handleUpdatePassword = async values => {
    // console.log(values)
    try {
      await updatePassword({
        oldPassword: values.current_password,
        newPassword: values.password,
      })
        .then(data => {
          setModal(!modal)
        })
        .catch(error => {
          console.error(error)
        })
        .finally(() => {
          console.log('CONFIRMED UPDATE PASSWORD')
        })
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <>
      <div className="table-responsive">
        <Table>
          <tbody>
            <tr>
              <td>{t('Email')} :</td>
              <td>
                {profile?.email}
                <span
                  className="custom-anchor ms-2"
                  onClick={() => setModal('email')}
                >
                  {t('Edit')}
                </span>
              </td>
            </tr>
            <tr>
              <td>{t('Password')} :</td>
              <td>
                ●●●●●●
                <span
                  className="custom-anchor ms-2"
                  onClick={() => setModal('password')}
                >
                  {t('Edit')}
                </span>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
      <EmailPasswordModal modal={modal} setModal={setModal} profile={profile} />
    </>
  )
}

export default EmailPassword
