import React, { useContext, useState, useEffect } from 'react'
import Link from 'next/link'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import { useRouter } from 'next/navigation'
import { RiLogoutBoxRLine, RiShoppingCartLine, RiUserLine } from 'react-icons/ri'
// import { LogoutAPI } from '@/Utils/AxiosUtils/API'
// import useCreate from '@/Utils/Hooks/useCreate'
import ConfirmationModal from '@/Components/Common/ConfirmationModal'
import AccountContext from '@/Helper/AccountContext'
import Avatar from '@/Components/Common/Avatar'
import { BsCart4 } from 'react-icons/bs'
import { MdOutlineLogin } from 'react-icons/md'

function MenuUser({ signOut }) {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  return (
    <>
      <li className="product-box-contain">
        <Link href={`/${i18Lang}/account/dashboard`}>
          <RiUserLine className="me-2" /> {t('MyAccount')}
        </Link>
      </li>
      <li className="product-box-contain">
        <Link href={`/${i18Lang}/account/order`}>
          <BsCart4 className="me-2" /> {t('MyOrders')}
        </Link>
      </li>
      <li className="product-box-contain" onClick={signOut}>
        <a>
          <RiLogoutBoxRLine className="me-2" /> {t('LogOut')}
        </a>
      </li>
    </>
  )
}

function MenuGuest() {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  return (
    <>
      <li className="product-box-contain">
        <Link href={`/${i18Lang}/auth/login`}>
          <RiUserLine className="me-2" /> {t('Login')}
        </Link>
      </li>
      <li className="product-box-contain">
        <Link href={`/${i18Lang}/auth/register`}>
          <RiUserLine className="me-2" /> {t('SignUp')}
        </Link>
      </li>
    </>
  )
}


const HeaderProfile = () => {
  //TODO: Connect with AuthContext?
  // Signin Menu
  const { i18Lang } = useContext(I18NextContext)
  const { auth, signOut, profile } = useContext(AccountContext)
  const router = useRouter()
  const [modal, setModal] = useState(false)
  const { t } = useTranslation(i18Lang, 'common')
  const [profileImage, setprofileImage] = useState({
    original_url: profile,
  })

  useEffect(() => {
    if (profile) {  // Assuming `profile` holds the new URL or an object with `original_url`
      setprofileImage({
        original_url: profile,  // Here assuming profile is just the URL string
      });
    }
  }, [profile]);

  return (
    <li className="right-side onhover-dropdown">
      <div className="delivery-login-box">
        <div className="delivery-icon"  style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {auth?.username && <Avatar styleAvatar={{ borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} data={profileImage} />}
          {!auth?.username && (
             <MdOutlineLogin />
          )}
        </div>
      </div>

      <div className="onhover-div onhover-div-login">
        <ul className="user-box-name">
          {auth?.username ? (
            <MenuUser setModal={setModal} i18Lang={i18Lang } signOut={signOut}/>
          ) : (
            <MenuGuest setModal={setModal} i18Lang={i18Lang} />
          )}

          {/* <ConfirmationModal
            modal={modal}
            setModal={setModal}
            confirmFunction={signOut}
            isLoading={auth?.loading}
          /> */}
        </ul>
      </div>
    </li>
  )
}

export default HeaderProfile
