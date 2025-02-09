import { AiFillShop } from 'react-icons/ai'
import { Col } from 'reactstrap'
import Link from 'next/link'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import { useContext, useState } from 'react'
import { useRouter } from 'next/navigation';


const TopbarLeft = () => {
  const router = useRouter();
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')

  const handleNavigation = (e) => {
    e.preventDefault();
    router.push(`/${i18Lang}/seller/become-seller`);
  };

  return (
    <Col xs={8} xxl={3} className="d-xxl-block">
      <div className="top-left-header">
        <AiFillShop className="text-white" />
        {/* <Link href={`${i18Lang}/seller/become-seller`} className="text-white" passHref> */}
        <a className="text-white" onClick={handleNavigation}>
          {t("Trở thành người bán hàng")}
        </a>
        {/* </Link> */}
      </div>
    </Col>
  )
}

export default TopbarLeft
