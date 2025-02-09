import React, { useContext, useState, useEffect } from 'react'
import { Input } from 'reactstrap'
import Image from 'next/image'
import { Col, Row, Collapse } from 'reactstrap'
import SettingContext from '@/Helper/SettingContext'
import Btn from '@/Elements/Buttons/Btn'
import { useTranslation } from '@/app/i18n/client'
import I18NextContext from '@/Helper/I18NextContext'
import OfferImage from '../../../../public/assets/images/offer.gif'
import { FaChevronCircleDown } from "react-icons/fa";
import { fetchAuthSession } from "aws-amplify/auth"
import { getHostApi } from '@/Utils/AxiosUtils'
import AppliedCouponDetails from './AppliedCouponDetails'
import Link from 'next/link'

const ApplyCoupon = ({ values, setFieldValue, setStoreCoupon, storeCoupon, cartProducts }) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const [appliedCoupon, setAppliedCoupon] = useState(false)
  const [allCoupon, setAllCoupon] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const { convertCurrency } = useContext(SettingContext)

  // const onCouponApply = value => {
  //   setStoreCoupon(value)
  // }
  const toggle = () => setIsOpen(!isOpen);

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setFieldValue('coupon_detail', '')
    // setStoreCoupon('')
  }
  
  useEffect(() => {
    const handleCoupon = async () => {
      try {
        const token = await fetchAuthSession()
          .then(session => session?.tokens?.idToken.toString())
          .catch(() => null)
  
        const coupon = await fetch(`${getHostApi()}coupon`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
          .then(res => res.json())
          .catch(error => {
            console.error(error.message)
            return []
        })
        
        setAllCoupon(coupon)
      } catch (error) {
        console.error('Error fetching coupon', error)
      }
    }
  
    handleCoupon()
  }, [])
  

  const handleSelectCoupon = elem => {
    console.log('elem', elem)
    setFieldValue('coupon_detail', elem)
    setAppliedCoupon('applied')
  }

  return (
    <>
      {appliedCoupon == 'applied' ? (
        <li className="coupon-sec">
          <div className="apply-sec mb-3">
            <div>
              <Image
                src={OfferImage}
                className="img-fluid"
                height={20}
                width={20}
                alt="offer"
              />
             {values?.coupon_detail && <AppliedCouponDetails values={values} cartProducts={cartProducts}/>}
            </div>
            <a onClick={() => removeCoupon()}>{t('Remove')}</a>
          </div>
        </li>
      ) : (
        <li className="coupon-sec">
          <div className="accordion">
            <div className="accordion-item" style={{ width: '100%', border: 'none', paddingLeft: '0', backgroundColor: 'transparent', fontSize: '1rem', textAlign: 'left' }}>
              <h2 className="accordion-header">
                <button type="button" onClick={toggle} style={{ width: '100%', border: 'none', paddingLeft: '0', backgroundColor: 'transparent', fontSize: '1rem', textAlign: 'left' }}>
                  <Row>
                    <Col xs="11">
                      Mã giảm giá
                    </Col>
                    <Col xs="1">
                      <FaChevronCircleDown />
                    </Col>
                  </Row>
                </button>
              </h2>
              <Collapse isOpen={isOpen}>
                <div className="accordion-collapse">
                  <div className="accordion-body">
                    <br></br>
                    <ul className="">
                      <li>
                        <div className="coupon-box mt-2 mb-3 d-flex w-100">
                          <div className="input-group">
                            <Input
                              type="text"
                              placeholder={t('EnterCoupon')}
                              onChange={e => onCouponApply(e.target.value)}
                            />
                            <Btn
                              className="btn-apply"
                              onClick={() =>
                                storeCoupon !== '' && setAppliedCoupon('applied')
                              }
                            >
                              {t('Apply')}
                            </Btn>
                          </div>
                        </div>
                      </li>
                      {allCoupon?.map((elem, i) => (
                        <li key={i} onClick={() => handleSelectCoupon(elem)} className="recent-box" style={{ borderBottom: '1px solid gray', paddingBottom: '15px' }}>
                          <Row>
                            <Col xs="3">
                              <div className="recent-image">
                                <Image
                                  src="https://kamarket-prod-storage.s3.ap-southeast-1.amazonaws.com/public/sale.png"
                                  alt="Casual vests"
                                  width={50}
                                  height={50}
                                  className=""
                                />
                              </div>
                            </Col>
                            {elem?.start_date ?
                              <Col xs="9">
                                <div className="recent-detail">
                                  <h5 className="recent-name">{elem?.title}</h5>
                                  <h6>
                                    {!elem?.is_expired
                                      ? `${new Date(elem?.start_date).toLocaleDateString('en-GB')} - Not Expired`
                                      : `${new Date(elem?.start_date).toLocaleDateString('en-GB')} - ${new Date(elem?.end_date).toLocaleDateString('en-GB')}`}
                                  </h6>
                                  <Link href={`/${i18Lang}/coupon/${elem?.CouponId}`}>
                                    <h6>{elem?.amount || 'Free'} - Chi tiết</h6>
                                  </Link>
                                </div>
                              </Col>
                              : <Col xs="9">
                                <div className="recent-detail">
                                  <h5 className="recent-name">{elem?.title}</h5>
                                  <h6>{new Date(elem?.createdAt).toLocaleDateString('en-GB')}</h6>
                                  <Link href={`/${i18Lang}/coupon/${elem?.CouponId}`}>
                                    <h6>Chi tiết</h6>
                                  </Link>
                                </div>
                              </Col>
                            }
                          </Row>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Collapse>
            </div>
          </div>
        </li>
      )}
    </>
  )
}

export default ApplyCoupon
