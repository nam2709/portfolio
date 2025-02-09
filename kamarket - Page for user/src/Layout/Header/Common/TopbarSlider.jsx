import React, { useContext } from 'react'
import ThemeOptionContext from '@/Helper/ThemeOptionsContext'
import { Col } from 'reactstrap'
import Slider from 'react-slick'
import { topBarContentSlider } from '../../../../Data/SliderSettingsData'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'

const TopbarSlider = ({ customClass }) => {
  const { themeOption } = useContext(ThemeOptionContext)
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  return (
    <>
      {customClass ? (
        <div className="notification-slider">
          <Slider {...topBarContentSlider}>
            {themeOption?.header?.top_bar_content.length > 0 &&
              themeOption?.header?.top_bar_content?.map((elem, i) => (
                <div key={i}>
                  <div className={`timer-notification ${customClass}`}>
                    <h6>
                      <strong className="me-1">{t(elem?.content)}</strong>
                    </h6>
                  </div>
                </div>
              ))}
          </Slider>
        </div>
      ) : (
        <Col lg={9} xxl={6} className="d-lg-block d-none">
          <div className="header-offer">
            <div className="notification-slider no-arrow">
              <Slider {...topBarContentSlider}>
                {themeOption?.header?.top_bar_content.length > 0 &&
                  themeOption?.header?.top_bar_content?.map((elem, i) => (
                    <div key={i}>
                      <div className={`timer-notification`}>
                        <h6>
                          <div
                            dangerouslySetInnerHTML={{ __html: t(elem?.content) }}
                          />
                        </h6>
                      </div>
                    </div>
                  ))}
              </Slider>
            </div>
          </div>
        </Col>
      )}
    </>
  )
}

export default TopbarSlider
