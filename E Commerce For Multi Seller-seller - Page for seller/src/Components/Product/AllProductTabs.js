import { Col, TabContent, TabPane } from 'reactstrap'
import GeneralTab from './GeneralTab'
import InventoryTab from './InventoryTab'
import SetupTab from './SetupTab'
import ImagesTab from './ImagesTab'
import SeoTab from './SeoTab'
import ShippingTaxTab from './ShippingTaxTab'
import OptionsTab from './OptionsTab'

const AllProductTabs = ({ values, setFieldValue, errors, updateId, activeTab, vendor }) => {
    
    return (
        <Col xl="7" lg="8">
            <TabContent activeTab={activeTab}>
                <TabPane tabId="1" className="some">
                    <GeneralTab values={values} setFieldValue={setFieldValue} vendor={vendor}/>
                    <SetupTab values={values} setFieldValue={setFieldValue} errors={errors} updateId={updateId} />
                </TabPane>
                <TabPane tabId="2">
                    <InventoryTab values={values} setFieldValue={setFieldValue} errors={errors} updateId={updateId} />
                </TabPane>
                {/* <TabPane tabId="3">
                    <SetupTab values={values} setFieldValue={setFieldValue} errors={errors} updateId={updateId} />
                </TabPane> */}
                <TabPane tabId="3">
                    <ImagesTab values={values} setFieldValue={setFieldValue} errors={errors} updateId={updateId} vendor={vendor} />
                </TabPane>
                <TabPane tabId="4">
                    <SeoTab values={values} setFieldValue={setFieldValue} updateId={updateId} />
                </TabPane>
                <TabPane tabId="5">
                    <ShippingTaxTab />
                </TabPane>
                <TabPane tabId="6">
                    <OptionsTab />
                </TabPane>
            </TabContent>
        </Col>
    )
}

export default AllProductTabs