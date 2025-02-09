import React, { useContext } from 'react'
import ProductSection1 from '../HomePages/ProductSections/ProductSection1'
import OfferBanner from '../HomePages/OfferBanner'
import DetailedBanner from './DetailedBanner'
import WrapperComponent from '../Common/WrapperComponent'
import { LeafSVG } from '../Common/CommonSVG'
import ProductIdsContext from '@/Helper/ProductIdsContext'
import {
  osakaFullSlider,
  osakaSliderOption,
} from '../../../Data/SliderSettingsData'

const MiddleContent = ({ dataAPI }) => {
  const { filteredProduct } = useContext(ProductIdsContext)
  return (
    <>
      {dataAPI?.products_list_1?.status &&
        dataAPI?.products_list_1?.product_ids.length > 0 && (
          <WrapperComponent noRowCol={true}>
            <ProductSection1
              ProductData={filteredProduct}
              svgUrl={<LeafSVG className="icon-width" />}
              dataAPI={dataAPI?.products_list_1}
              noCustomClass={true}
              customSliderOption={osakaFullSlider}
              classObj={{ productStyle: 'product-modern', productBoxClass: '' }}
            />
          </WrapperComponent>
        )}

      {dataAPI?.offer_banner?.status && (
        <WrapperComponent colProps={{ xs: 12 }}>
          <OfferBanner
            classes={{ customHoverClass: 'offer-box hover-effect' }}
            imgUrl={dataAPI?.offer_banner?.image_url}
            elem={dataAPI?.offer_banner}
          />
        </WrapperComponent>
      )}

      {dataAPI?.products_list_2?.status &&
        dataAPI?.products_list_2?.product_ids.length > 0 && (
          <WrapperComponent noRowCol={true}>
            <ProductSection1
              ProductData={filteredProduct}
              svgUrl={<LeafSVG className="icon-width" />}
              dataAPI={dataAPI?.products_list_2}
              noCustomClass={true}
              customSliderOption={osakaFullSlider}
              classObj={{ productStyle: 'product-modern', productBoxClass: '' }}
            />
          </WrapperComponent>
        )}

      {dataAPI?.product_bundles?.status &&
        dataAPI?.product_bundles?.bundles?.length > 0 && (
          <WrapperComponent noRowCol={true}>
            <DetailedBanner dataAPI={dataAPI?.product_bundles?.bundles} />
          </WrapperComponent>
        )}
    </>
  )
}

export default MiddleContent
