import { useContext } from 'react'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import Link from 'next/link'
import { MdNavigateNext } from 'react-icons/md'

const CustomHeading = props => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const {
    title,
    subTitle,
    svgUrl,
    customClass,
    customTitleClass,
    svgClass = '',
    linkNext,
  } = props
  return (
    <div
      className={`${customTitleClass ? customTitleClass : customClass ? customClass + ' ' : 'title d-block'}`}
    >
      <div>
        <div className="d-flex justify-content-between">
          <div>
            <h2>{t(title)}</h2>
          </div>
          {linkNext && (
            <div className="d-center h-100">
              <Link href={linkNext} className="link-href-more">
                {t("Xem Tất Cả")} <MdNavigateNext />
              </Link>
            </div>
          )}
        </div>

        {svgUrl && <span className="title-leaf">{svgUrl}</span>}
        {/* {subTitle && <p>{t(subTitle)}</p>} */}
      </div>
      {props.children && props.children}
    </div>
  )
}

export default CustomHeading
