import React, { useContext, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiLogOut } from 'react-icons/fi'
import { Media, Spinner } from 'reactstrap'
import Cookies from 'js-cookie'
import { RiArrowDownSLine, RiQuestionLine, RiUserLine } from 'react-icons/ri'
import AccountContext from '../../Helper/AccountContext'
import Avatar from '../../Components/CommonComponent/Avatar'
import Btn from '../../Elements/Buttons/Btn'
import ShowModal from '../../Elements/Alerts&Modals/Modal'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import { fetchAuthSession, signOut } from 'aws-amplify/auth'
import useSWR from 'swr'


const ProfileNav = ({ isComponentVisible, setIsComponentVisible }) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const [modal, setModal] = useState(false)
  const router = useRouter()
  const { accountData, accountContextData } = useContext(AccountContext)
  const isStateData =
    (accountContextData.image && Object?.keys(accountContextData.image).length > 0) ||
    accountContextData.image == ''
  const [loading, setLoading] = useState(null)

  async function fetchVendorOrder() {
    const token = await fetchAuthSession()
      .then(session => session)
      .catch(() => null)
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors/${token?.userSub}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token?.tokens?.idToken?.toString()}`,
      },
    }).then(res => res.json())
  }

  const { data, error, isLoading, mutate } = useSWR(`/vendors`, fetchVendorOrder)

  const handelLogout = async () => {
    setLoading(true)
    try {
      await signOut()
      Cookies.remove('uat')
      Cookies.remove('ue')
      Cookies.remove('account')
      localStorage.removeItem('account')
      localStorage.removeItem('role')
      setLoading(false)
      router.push(`/${i18Lang}/auth/login`)
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <>
      <li className="profile-nav onhover-dropdown pe-0 me-0">
        <Media
          className="profile-media"
          onClick={() => setIsComponentVisible(prev => (prev !== 'account' ? 'account' : ''))}
        >
          {accountContextData?.iamge ? <Avatar
            data={isStateData ? accountContextData.image : accountData?.profile_image}
            name={accountData}
            customeClass={'rounded-circle'}
          /> : <Avatar
          data={{url: "/assets/images/data/avatar.png"}}
          name={accountData}
          customeClass={'rounded-circle'}/>}
          <Media body className="user-name-hide">
            {/* <span>
              {accountContextData.name !== '' ? accountContextData.name : accountData?.name}
            </span> */}
            {/* <p className="mb-0 font-roboto">
              {accountData ? accountData?.role?.name : t('Account')}
              <RiArrowDownSLine className="middle" />
            </p> */}
          </Media>
        </Media>
        <ul
          className={`profile-dropdown onhover-show-div ${isComponentVisible == 'account' ? 'active' : ''}`}
        >
          <li>
            <Link href={`/${i18Lang}/account`}>
              <RiUserLine />
              <span>{t('MyAccount')}</span>
            </Link>
          </li>
          <li>
            <a onClick={() => setModal(true)}>
              <FiLogOut />
              <span>{t('Logout')}</span>
            </a>
          </li>
        </ul>
      </li>
      <ShowModal
        open={modal}
        close={false}
        buttons={
          <>
            <Btn title="No" onClick={() => setModal(false)} className="btn--no btn-md fw-bold" />
            {loading ? (
              <Spinner />
            ) : (
              <Btn
                title="Yes"
                onClick={async () => await handelLogout()}
                className="btn-theme btn-md fw-bold"
              ></Btn>
            )}
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

export default ProfileNav
