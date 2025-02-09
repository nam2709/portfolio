import { useContext } from 'react'
import { Col } from 'reactstrap'
import Link from 'next/link'
import ThemeOptionContext from '@/Helper/ThemeOptionsContext'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import CategoryContext from '@/Helper/CategoryContext'

const FooterCategory = ({ footerMenu, setFooterMenu }) => {
  const { themeOption } = useContext(ThemeOptionContext)
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const { filterCategory } = useContext(CategoryContext)
  const categoryData = filterCategory('product')
  return (
    <Col xl={3} lg={3} md={4} sm={6}>
      <div
        className={`footer-title ${footerMenu == 'category' ? 'show' : ''}`}
        onClick={() =>
          setFooterMenu(prev => (prev !== 'category' ? 'category' : ''))
        }
      >
        <h4>{t('DetailedInformation')}</h4>
      </div>

      <div className="footer-contain">
        <ul>
          {themeOption?.footer?.detailed_info?.map((elem, i) => (
            <li key={i}>
              <Link
                href={`/${i18Lang}/${elem.link}`}
                className="text-content text-capitalize"
              >
                {t(elem.label)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Col>
  )
}

export default FooterCategory
