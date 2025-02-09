import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from '@/app/i18n/client'
// import { useQuery } from '@tanstack/react-query'
import { Form, Formik } from 'formik'
import { Row, Col, Card } from 'reactstrap'
import { PolicyTabTitleListData } from '../../Data/TabTitleListData'
// import request from '../../Utils/AxiosUtils'
// import { Policy } from '../../Utils/AxiosUtils/API'
import { YupObject, nameSchema } from '../../Utils/Validation/ValidationSchemas'
// import Loader from '../CommonComponent/Loader'
import TabTitle from '../Coupon/TabTitle'
// import { PolicyInitValues, PolicyValidationSchema } from './PolicyObjects'
// import PolicySubmitFunction from './PolicySubmitFunction'
import SettingContext from '../../Helper/SettingContext'
import AllPolicyTabs from './AllPolicyTabs'
import I18NextContext from '@/Helper/I18NextContext'
import { useRouter } from 'next/navigation'

const PolicyForm = ({ setResetKey, updateId, title }) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('1')
  const { state } = useContext(SettingContext)

  return (
    <div className="theme-form theme-form-2 mega-form vertical-tabs">
      <Row>
        <Col>
          <Card>
            <div className="title-header option-title">
              <h5>{t(title)}</h5>
            </div>
            <Row>
              <Col xl="3" lg="4">
                <TabTitle
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  titleList={PolicyTabTitleListData}
                />
              </Col>
              <AllPolicyTabs
                activeTab={activeTab}
              />
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
)
}

export default PolicyForm
