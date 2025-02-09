import Image from 'next/image'
import googleImage from '../../../../public/assets/images/inner-page/google.png'
import facebookImage from '../../../../public/assets/images/inner-page/facebook.png'
import Link from 'next/link'
import { useContext } from 'react'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'

const LoginButton = ({ title = {} }) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  return (
    <div className="log-in-button">
      <ul>
        <li>
          <Link
            href="https://accounts.google.com/signin/v2/identifier?flowName=GlifWebSignIn&flowEntry=ServiceLogin"
            className="btn google-button w-100"
            target="_blank"
          >
            <Image
              src={googleImage}
              alt="Google image"
              height={24}
              width={24}
            />
            {t(title?.title1)}
          </Link>
        </li>
        <li>
          <Link
            href="https://www.facebook.com/"
            className="btn google-button w-100"
            target="_blank"
          >
            <Image
              src={facebookImage}
              alt="Facebook image"
              height={24}
              width={24}
            />{' '}
            {t(title?.title2)}
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default LoginButton
