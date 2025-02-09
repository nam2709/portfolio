import I18NextContext from '@/Helper/I18NextContext'
import Link from 'next/link'
import { useContext } from 'react'
import { RiHeartLine } from 'react-icons/ri'
import WishlistContext from '@/Helper/WishlistContext'
import { useTranslation } from '@/app/i18n/client'

const HeaderWishList = ({ wishListIcon }) => {
  const { WishlistProducts } = useContext(WishlistContext)
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  return (
    <li className="right-side">
      <Link
        href={`/${i18Lang}/wishlist`}
        className="btn p-0 position-relative header-wishlist"
      >
        {wishListIcon ? wishListIcon : <RiHeartLine />}
        {WishlistProducts?.length > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge">
              {WishlistProducts?.length}
              <span className="visually-hidden">{t('unreadmessages')}</span>
            </span>
        )}
      </Link>
    </li>
  )
}

export default HeaderWishList
