'use client'
import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';  // Corrected import
import Btn from '@/Elements/Buttons/Btn';
import ThemeOptionContext from '@/Helper/ThemeOptionsContext';
import Avatar from '@/Components/Common/Avatar';
import Link from 'next/link';
import { RiMenuLine } from 'react-icons/ri';
import logo from '../../../../public/assets/images/logo/logo.png';

const HeaderLogo = () => {
  const param = useParams();
  const { mobileSideBar, setMobileSideBar } = useContext(ThemeOptionContext);
  const [linkHref, setLinkHref] = useState("/en");  // Default link

  useEffect(() => {
    if (param) {
      const pathPrefix = param.lng;
      switch(pathPrefix) {
        case 'ko':
        case 'vi':
        case 'en':
        case 'zh-CN':
          setLinkHref(`/${pathPrefix}`);
          break;
        default:
          setLinkHref('/en');  // Default fallback
      }
    }
  }, [param]);  // Depend on isReady and pathname

  return (
    <>
      <Btn
        className="navbar-toggler d-xl-none d-inline navbar-menu-button me-2"
        type="button"
        onClick={() => setMobileSideBar(!mobileSideBar)}
      >
        <span className="navbar-toggler-icon">
          <RiMenuLine />
        </span>
      </Btn>
      <Link href={linkHref} className="web-logo nav-logo">
        <Avatar
          data={logo}
          placeHolder={logo}
          name={'Header'}
          customImageClass={'img-fluid'}
          height={28}
          width={162}
        />
      </Link>
    </>
  );
};

export default HeaderLogo;