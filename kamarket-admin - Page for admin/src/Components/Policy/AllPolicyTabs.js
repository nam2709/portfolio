import { Col, TabContent, TabPane } from 'reactstrap'
import BuyingGuide from './BuyingGuide'
import AboutUs from './AboutUs'
import Terms from './Terms'
import PrivacyPolicy from './PrivacyPolicy'
import DeliveryPolicy from './DeliveryPolicy'
import GuaranteePolicy from './GuaranteePolicy'
import ReturnPolicy from './ReturnPolicy'
import Payments from './Payments'

const AllPolicyTabs = ({ activeTab }) => {
  return (
    <Col xl="7" lg="8">
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1" className="some">
          <BuyingGuide />
        </TabPane>
        <TabPane tabId="2">
          <AboutUs />
        </TabPane>
        <TabPane tabId="3">
          <Terms/>
        </TabPane>
        <TabPane tabId="4">
          <PrivacyPolicy/>
        </TabPane>
        <TabPane tabId="5">
          <DeliveryPolicy/>
        </TabPane>
        <TabPane tabId="6">
          <GuaranteePolicy/>
        </TabPane>
        <TabPane tabId="7">
          <ReturnPolicy/>
        </TabPane>
        <TabPane tabId="8">
          <Payments/>
        </TabPane>
      </TabContent>
    </Col>
  )
}

export default AllPolicyTabs
