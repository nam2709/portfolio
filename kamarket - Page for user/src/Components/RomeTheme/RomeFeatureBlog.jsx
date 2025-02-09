import React from 'react'
import WrapperComponent from '../Common/WrapperComponent'
import CustomHeading from '../Common/CustomHeading'
import FeatureBlog from '../HomePages/FeatureBlog'
import { romeBlogSliderOption } from '../../../Data/SliderSettingsData'

const RomeFeatureBlog = ({ dataAPI }) => {
  return (
    <WrapperComponent classes={{ sectionClass: '' }}>
      <CustomHeading title={dataAPI?.featured_blogs?.title} />
      <FeatureBlog
        dataAPI={dataAPI?.featured_blogs}
        classes={{
          sliderClass: 'slider-3 arrow-slider',
          sliderOption: romeBlogSliderOption,
          ratioClass: 'ratio_65',
        }}
      />
    </WrapperComponent>
  )
}

export default RomeFeatureBlog
