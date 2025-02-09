import React, { useContext, useEffect, useState } from 'react'
import { Col } from 'reactstrap'
import Link from 'next/link'
import { RiHomeLine, RiMailLine } from 'react-icons/ri'
import Avatar from '@/Components/Common/Avatar'
import ThemeOptionContext from '@/Helper/ThemeOptionsContext'
import { placeHolderImage } from '../../../Data/CommonPath'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import { usePathname, useParams } from 'next/navigation'
import logo from '../../../public/assets/images/logo/logo.png'

const FooterLogoContent = () => {
  const { themeOption } = useContext(ThemeOptionContext)
  const [logoAbc, setLogo] = useState('')
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const pathName = usePathname()
  const param = useParams()
  const [linkHref, setLinkHref] = useState("/en"); 

  useEffect(() => {
    let logo = themeOption?.logo?.footer_logo
    if (pathName == `/${i18Lang}/theme/paris`) {
      logo = { original_url: ParisLogo }
    } else if (pathName == `/${i18Lang}/theme/tokyo`) {
      logo = { original_url: TokyoLogo }
    } else if (pathName == `/${i18Lang}/theme/rome`) {
      logo = { original_url: RomeLogo }
    } else if (pathName == `/${i18Lang}/theme/madrid`) {
      logo = { original_url: MadridLogo }
    } else if (
      pathName == `/${i18Lang}/theme/berlin` ||
      pathName == `/${i18Lang}/theme/denver`
    ) {
      logo = { original_url: OtherLogo }
    } else {
      logo = themeOption?.logo?.footer_logo
    }
    setLogo(logo)
  }, [pathName, i18Lang, themeOption?.logo?.footer_logo])

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
  }, [param]);

  return (
    <Col xl={3} sm={6}>
      <div className="footer-logo">
        <div className="theme-logo">
          <Link href={linkHref}>
            <Avatar
              data={logo}
              placeHolder={logo}
              name={'Footer'}
              height={40}
              width={240}
            />
          </Link>
        </div>

        <div className="footer-logo-contain">
          {themeOption?.footer?.footer_about && (
            <p>{t(themeOption?.footer?.footer_about)}</p>
          )}

          <ul className="address">
            {themeOption?.footer?.about_address && (
              <li>
                <span>
                  <RiHomeLine />
                </span>
                <Link href="https://www.google.com/maps" target="_blank">
                  {t(themeOption?.footer?.about_address)}
                </Link>
              </li>
            )}
            {themeOption?.footer?.about_email && (
              <li>
                <span>
                  <RiMailLine />
                </span>
                <Link
                  href={`mailto:${themeOption?.footer?.about_email}`}
                  target="_blank"
                >
                  {t(themeOption?.footer?.about_email)}
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </Col>
  )
}

export default FooterLogoContent
