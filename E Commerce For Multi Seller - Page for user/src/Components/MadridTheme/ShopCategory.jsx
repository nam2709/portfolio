import React, { useContext, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Slider from 'react-slick'
import { Col, Row } from 'reactstrap'
import WrapperComponent from '../Common/WrapperComponent'
import CustomHeading from '../Common/CustomHeading'
import Btn from '@/Elements/Buttons/Btn'
import { madridCategorySlider } from '../../../Data/SliderSettingsData'
import { placeHolderImage } from '../../../Data/CommonPath'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import CategoryContext from '@/Helper/CategoryContext'
import { RiArrowRightSLine } from 'react-icons/ri'

const ShopCategory = ({ dataAPI }) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const { filterCategory } = useContext(CategoryContext)
  const categoryData = useMemo(() => {
    return dataAPI?.category_ids.length > 0
      ? filterCategory('product')?.filter(category =>
          dataAPI?.category_ids?.includes(category.id)
        )
      : filterCategory('product')
  }, [filterCategory('product')])
  return (
    <WrapperComponent
      classes={{ sectionClass: 'category-section-3' }}
      noRowCol={true}
    >
      <CustomHeading title={dataAPI?.title} customClass={'title'} />
      <Row>
        <Col xs={12}>
          <div className="category-slider-1 arrow-slider">
            <Slider {...madridCategorySlider}>
              {categoryData?.map(elem => (
                <div key={elem.id}>
                  <div className="category-box-list">
                    <Link
                      href={`/${i18Lang}/collections?category=${elem?.slug}`}
                      className="category-name"
                    >
                      <h4>{elem?.name}</h4>
                      <h6>
                        {elem?.products_count} {t('items')}
                      </h6>
                    </Link>
                    <div className="category-box-view">
                      <Link
                        href={`/${i18Lang}/collections?category=${elem?.slug}`}
                      >
                        <Image
                          src={
                            elem?.category_image?.original_url ||
                            placeHolderImage
                          }
                          className="img-fluid"
                          alt="Shop Category"
                          height={133}
                          width={133}
                        />
                      </Link>
                      <Btn className="btn shop-button">
                        <span>{t('ShopNow')}</span>
                        <RiArrowRightSLine />
                      </Btn>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </Col>
      </Row>
    </WrapperComponent>
  )
}

export default ShopCategory
