import React, { useContext } from 'react'
import { Col } from 'reactstrap'
import Link from 'next/link'
import ThemeOptionContext from '@/Helper/ThemeOptionsContext'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'

const FooterQuickPage = ({ footerMenu, setFooterMenu }) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const { themeOption } = useContext(ThemeOptionContext)
  return (
    <>
      {/* <div
        className={`footer-title ${footerMenu == 'pages' ? 'show' : ''}`}
        onClick={() => setFooterMenu(prev => (prev !== 'pages' ? 'pages' : ''))}
      >
        <h4>{t('QuickPages')}</h4>
      </div>

      <div className="footer-contain">
        <ul>
          {themeOption?.footer?.help_center?.map((elem, i) => (
            <li key={i}>
              <Link href={`/${i18Lang}/${elem?.link}`} className="text-content">
                {t(elem.label)}
              </Link>
            </li>
          ))}
        </ul>
      </div> */}
    </>
  )
}

export default FooterQuickPage
