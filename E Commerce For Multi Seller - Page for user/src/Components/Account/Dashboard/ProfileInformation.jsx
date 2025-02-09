import Image from 'next/image'
import { useContext } from 'react'
import { Col, Row, Table } from 'reactstrap'

import AccountContext from '@/Helper/AccountContext'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import dashProfileImage from '../../../../public/assets/images/inner-page/dashboard-profile.png'
import EmailPassword from './EmailPassword'

const ProfileInformation = ({ profile }) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const { accountData } = useContext(AccountContext)
  return (
    <div className="profile-about dashboard-bg-box">
      <Row>
        <Col xxl={7}>
          <div className="dashboard-title mb-3">
            <h3>{t('ProfileInformation')}</h3>
          </div>

          <div className="table-responsive">
            <Table>
              <tbody>
                <tr>
                  <td>{t('Name')} :</td>
                  <td>{profile?.name}</td>
                </tr>
                <tr>
                  <td>{t('PhoneNumber')} :</td>
                  <td>
                    {profile?.phone_number}
                    {/* +{accountData?.country_code}  */}
                  </td>
                </tr>
                {profile?.addressDetail && (
                  <tr>
                    <td>{t('Address')} :</td>
                    <td>
                      {profile?.addressDetail?.street},{' '}
                      {profile?.addressDetail?.ward},{' '}
                      {profile?.addressDetail?.district},{' '}
                      {profile?.addressDetail?.city}{' '}
                      {/* {accountData?.address[0]?.pincode} */}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          <div className="dashboard-title mb-3">
            <h3>{t('LoginDetails')}</h3>
          </div>
          <EmailPassword profile={profile} />
        </Col>
        <Col xxl={5}>
          <div className="profile-image">
            <Image
              src={dashProfileImage}
              className="img-fluid"
              alt="profile-image"
              height={450}
              width={450}
            />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default ProfileInformation
