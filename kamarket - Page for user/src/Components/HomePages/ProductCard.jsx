import React, { useContext } from 'react'
import { Col } from 'reactstrap'
import ProductSection1 from './ProductSections/ProductSection1'
import ProductSection1n from './ProductSections/ProductSection1n'
import ProductSection2 from './ProductSections/ProductSection2'
import ShowCaseBanner from './ShowCaseBanner'
import SingleBanner from './SingleBanner'
import TwoBanners from './TwoBanners'
import ProductSection4 from './ProductSections/ProductSection4'
import VegetableBanner from './VegetableBanner'
import { categorySliderOption } from '../../../Data/SliderSettingsData'
import { LeafSVG } from '../Common/CommonSVG'
import ProductIdsContext from '@/Helper/ProductIdsContext'
import { AiOutlineFire } from 'react-icons/ai'
import { BsBagHeart, BsSearchHeart } from 'react-icons/bs'
const ProductCard = ({ dataAPI }) => {
  const { filteredProduct } = useContext(ProductIdsContext)
  return (
    <Col xxl={12}>
      {dataAPI?.main_content?.section1_products?.status &&
        dataAPI?.main_content?.section1_products?.product_ids.length > 0 && (
          <ProductSection1
            dataAPI={dataAPI?.main_content?.section1_products}
            ProductData={filteredProduct}
            svgUrl={<AiOutlineFire className="icon-width" />}
            noCustomClass={false}
            classObj={{ productStyle: 'product-modern', productBoxClass: '' }}
            linkPage="/flash-sale"
          />
      )}
      {dataAPI?.main_content?.section1n_products?.status &&
        dataAPI?.main_content?.section1n_products?.product_ids.length > 0 && (
          <ProductSection1n
            dataAPI={dataAPI?.main_content?.section1n_products}
            ProductData={filteredProduct}
            svgUrl={<AiOutlineFire className="icon-width" />}
            noCustomClass={false}
            classObj={{ productStyle: 'product-modern', productBoxClass: '' }}
            linkPage="/pre-order"
          />
      )}
      <br></br>
      {dataAPI?.main_content?.section2_categories_list?.status && (
        <ProductSection2
          isHeadingVisible={true}
          dataAPI={dataAPI?.main_content?.section2_categories_list}
          svgUrl={<LeafSVG className="icon-width" />}
          classes={{ sliderOption: categorySliderOption }}
        />
      )}

      {dataAPI?.main_content?.section3_two_column_banners?.status && (
        <ShowCaseBanner
          dataAPI={dataAPI?.main_content?.section3_two_column_banners}
        />
      )}
      {/* {dataAPI?.main_content?.section4_products?.status && (
        <ProductSection2
          isHeadingVisible={true}
          dataAPI={dataAPI?.main_content?.section4_products}
          svgUrl={<BsSearchHeart className="icon-width" />}
          classes={{ sliderOption: categorySliderOption }}
        />
      )} */}
      {dataAPI?.main_content?.section5_coupons?.status && (
        <SingleBanner
          classes={{ sectionClass: 'section-t-space sale-banner' }}
          image_url={dataAPI?.main_content?.section5_coupons?.image_url}
          height={138}
          width={1137}
          dataAPI={dataAPI?.main_content?.section5_coupons}
        />
      )}
      {dataAPI?.main_content?.section6_two_column_banners?.status && (
        <TwoBanners dataAPI={dataAPI} />
      )}
      {dataAPI?.main_content?.section7_products?.status && (
        <ProductSection4
          dataAPI={dataAPI?.main_content?.section7_products}
          ProductData={filteredProduct}
          svgUrl={<BsBagHeart className="icon-width" />}
          classObj={{ productStyle: 'product-modern', productBoxClass: '' }}
          noCustomClass={false}
          linkPage="/daily-discover"
        />
      )}
      {/* {dataAPI?.main_content?.section8_full_width_banner?.status && <VegetableBanner dataAPI={dataAPI} />} */}
    </Col>
  )
}

export default ProductCard
