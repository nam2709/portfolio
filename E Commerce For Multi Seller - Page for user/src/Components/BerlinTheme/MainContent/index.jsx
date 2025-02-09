import { Col } from 'reactstrap'
import CategoryMenu from '@/Components/HomePages/CategoryMenu'
import OfferBanner from '@/Components/HomePages/OfferBanner'
import TrendingProduct from '@/Components/HomePages/TrendingProduct'
import WrapperComponent from '@/Components/Common/WrapperComponent'
import ProductSection1 from '@/Components/HomePages/ProductSections/ProductSection1'
import ProductSection2 from '@/Components/HomePages/ProductSections/ProductSection2'
import { categorySliderOption } from '../../../../Data/SliderSettingsData'
import ShowCaseBanner from '@/Components/HomePages/ShowCaseBanner'
import { LeafSVG } from '@/Components/Common/CommonSVG'

const MainContent = ({ dataAPI, ProductData }) => {
  return (
    <WrapperComponent
      classes={{ sectionClass: 'product-section', row: 'g-sm-4 g-3' }}
      customCol={true}
    >
      <Col
        xxl={dataAPI?.main_content?.sidebar?.status ? 9 : 12}
        xl={dataAPI?.main_content?.sidebar?.status ? 8 : 12}
      >
        {dataAPI?.main_content?.section1_products?.status &&
          dataAPI?.main_content?.section1_products?.product_ids?.length > 0 && (
            <ProductSection1
              dataAPI={dataAPI?.main_content?.section1_products}
              ProductData={ProductData}
              svgUrl={<LeafSVG className="icon-width" />}
              noCustomClass={true}
              classObj={{
                productStyle: 'product-classic',
                productBoxClass: 'product-box-bg',
              }}
            />
          )}

        {dataAPI?.main_content?.section2_categories_icon_list?.status && (
          <ProductSection2
            isHeadingVisible={true}
            dataAPI={dataAPI?.main_content?.section2_categories_icon_list}
            svgUrl={<LeafSVG className="icon-width" />}
            classes={{ sliderOption: categorySliderOption }}
          />
        )}

        {dataAPI?.main_content?.section3_two_column_banners?.status && (
          <ShowCaseBanner
            dataAPI={dataAPI?.main_content?.section3_two_column_banners}
          />
        )}

        {dataAPI?.main_content?.section4_products?.status &&
          dataAPI?.main_content?.section4_products?.product_ids?.length > 0 && (
            <ProductSection1
              dataAPI={dataAPI?.main_content?.section4_products}
              ProductData={ProductData}
              customClass="title"
              svgUrl={<LeafSVG className="icon-width" />}
              classObj={{
                productStyle: 'product-classic',
                productBoxClass: 'product-box-bg',
              }}
            />
          )}
      </Col>

      {dataAPI?.main_content?.sidebar?.status && (
        <Col xxl={3} xl={4} className="d-none d-xl-block">
          <div className="p-sticky">
            {dataAPI?.main_content?.sidebar?.categories_icon_list?.status &&
              dataAPI?.main_content?.sidebar?.categories_icon_list?.category_ids
                ?.length > 0 && (
                <CategoryMenu dataAPI={dataAPI} extraContent={false} />
              )}

            <OfferBanner
              classes={{
                customClass: 'ratio_156 section-t-space',
                customHoverClass: 'home-contain hover-effect',
              }}
              imgUrl={
                dataAPI?.main_content?.sidebar?.right_side_banners?.banner_1
                  ?.image_url
              }
              elem={
                dataAPI?.main_content?.sidebar?.right_side_banners?.banner_1
              }
              ratioImage={true}
            />

            {dataAPI?.main_content?.sidebar?.sidebar_products?.status &&
              dataAPI?.main_content?.sidebar?.sidebar_products?.product_ids
                ?.length > 0 && <TrendingProduct dataAPI={dataAPI} />}
          </div>
        </Col>
      )}
    </WrapperComponent>
  )
}

export default MainContent
