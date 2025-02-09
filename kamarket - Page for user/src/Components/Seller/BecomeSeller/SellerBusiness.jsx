import WrapperComponent from '@/Components/Common/WrapperComponent'
import ThemeOptionContext from '@/Helper/ThemeOptionsContext'
import { useContext } from 'react'
import { Row } from 'reactstrap'
import SellerSteps from './SellerSteps'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'

const SellerBusiness = () => {
  const { themeOption } = useContext(ThemeOptionContext)
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  return (
    <WrapperComponent
      classes={{ sectionClass: 'business-section section-b-space' }}
      noRowCol={true}
    >
      <div className="vendor-title mb-5">
        <h5>{t(themeOption?.seller?.steps?.title)}</h5>
      </div>

      <div className="business-contain">
        <Row className="g-xl-4 g-3">
          <SellerSteps data={themeOption?.seller?.steps?.step_1} number={1} />
          <SellerSteps data={themeOption?.seller?.steps?.step_2} number={2} />
          <SellerSteps data={themeOption?.seller?.steps?.step_3} number={3} />
        </Row>
      </div>
    </WrapperComponent>
  )
}

export default SellerBusiness
