import { useContext, useEffect, useState } from 'react'
import { useTranslation } from '@/app/i18n/client'
import AccountContext from '@/Helper/AccountContext'
import WrapperComponent from '@/Components/Common/WrapperComponent'
import ThemeOptionContext from '@/Helper/ThemeOptionsContext'
import { Col, Form, Input, Row } from 'reactstrap'
import Btn from '@/Elements/Buttons/Btn'
import { useRouter } from 'next/navigation'
import I18NextContext from '@/Helper/I18NextContext'
import SignUpSeller from './SignUpSeller'
import { fetchAuthSession } from 'aws-amplify/auth'

const SellerSelling = () => {
  const { auth } = useContext(AccountContext)
  const { themeOption } = useContext(ThemeOptionContext)
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const router = useRouter()
  const [isVendor, setIsVendor] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = await fetchAuthSession()
      .then(session => session?.tokens?.idToken?.toString())
      .catch(() => null)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/orders`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`, // assuming `auth` has a `token` property
        },
      });
      if (response.ok) { // This checks if the HTTP status code is in the 200-299 range
        setIsVendor(true);
      } else {
        setIsVendor(false);
      }
    };

    fetchData();
  }, []);
  
  return (
    <WrapperComponent
      classes={{ sectionClass: 'selling-section section-b-space' }}
    >
      <div className="vendor-title mb-3">
        <h5>{t(themeOption?.seller?.start_selling?.title)}</h5>
        <p>{t(themeOption?.seller?.start_selling?.description)}</p>
      </div>
      {/* <Form className="mt-3">
        <Row className="g-3">
          <Col sm="6">
            <Input type="email" placeholder="Email ID"></Input>
          </Col>
          <Col sm="6">
            <Input type="number" placeholder="Phone Number"></Input>
          </Col>
        </Row>
        <Btn
          title="Start Selling"
          type="button"
          className="text-light theme-bg-color d-inline-block mt-3"
          onClick={() => router.push(`/${i18Lang}/auth/register`)}
        />
      </Form> */}
      {auth?.userId && (
        !isVendor ? (
          <SignUpSeller />
        ) : (
          <div>
            <h3 style={{ color: '#0da487', textTransform: 'uppercase' }}>
              {t('You are already a vendor')}
            </h3>
          </div>
        )
      )}
      {!auth?.userId && (
        <div>
          <h3 style={{ color: '#0da487', textTransform: 'uppercase' }}>
            {t('Log in to your customer account to start registering and becoming a seller')}
          </h3>
        </div>
      )}
    </WrapperComponent>
  )
}

export default SellerSelling
