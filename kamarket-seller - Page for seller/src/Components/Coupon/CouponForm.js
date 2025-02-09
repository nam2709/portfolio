import { useQuery } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { Card, Col, Row, TabContent, TabPane } from "reactstrap";
import request from "../../Utils/AxiosUtils";
import { YupObject } from "../../Utils/Validation/ValidationSchemas";
import { CouponTabTitleListData } from "../../Data/TabTitleListData";
import FormBtn from "../../Elements/Buttons/FormBtn";
import TabTitle from "./TabTitle";
import GeneralTabContent from "./GeneralTabContent";
import RestrictionTabContent from "./RestrictionTabContent";
import UsageTabContent from "./UsageTabContent";
import { CouponValidation } from "./CouponValidation";
import { CouponInitialValues } from "./CouponInitialValues";
import I18NextContext from "@/Helper/I18NextContext";
import { useTranslation } from "@/app/i18n/client";
import { dateFormate } from "../../Utils/CustomFunctions/DateFormate";
import { useRouter } from "next/navigation";
import { fetchAuthSession } from 'aws-amplify/auth'
import { ToastNotification } from '@/Utils/CustomFunctions/ToastNotification'

const CouponForm = ({ updateId, title }) => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, 'common');
  const router =useRouter()
  const [activeTab, setActiveTab] = useState("1");
  const { data: oldData, isLoading: oldDataLoading, refetch } = useQuery(["/coupon/id"], () => request({ url: `/coupon/${updateId}` }), { enabled: false, refetchOnWindowFocus: false });
  useEffect(() => {
    updateId && refetch();
  }, [updateId]);

  const handleCoupon = async (values) => {
    const token = await fetchAuthSession()
    .then(session => session?.tokens?.idToken?.toString())
    .catch(error => null)
    console.log('updateId', updateId)

    if (updateId) {
      const respone = await fetch(`${process.env.NEXT_PUBLIC_COUPON_API}/coupon/${updateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      }).then(response => response.json())
      console.log('respone', respone)
      ToastNotification('success', 'Chỉnh sửa mã khuyến mãi thành công')
    } else {
      const respone = await fetch(`${process.env.NEXT_PUBLIC_COUPON_API}/coupon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      }).then(response => response.json())
      console.log('respone', respone)
      ToastNotification('success', 'Thêm mã khuyến mãi thành công')
    }
  }

  if (updateId && oldDataLoading) return null;
  return (
    <Formik
      initialValues={{ ...CouponInitialValues(updateId, oldData) }}
      // validationSchema={YupObject(CouponValidation)}
      onSubmit={async values => {
        console.log('values', values)
        await handleCoupon(values)
        // router.push(`/${i18Lang}/coupon`)
      }}
    >
      {({ values, setFieldValue, errors, touched }) => (
        <Col>
          <Card>
            <div className="title-header option-title">
              <h5>{t(title)}</h5>
            </div>
            <Form className="theme-form theme-form-2 mega-form vertical-tabs">
              <Row>
                <Col xl="3" lg="4">
                  <TabTitle activeTab={activeTab} setActiveTab={setActiveTab} titleList={CouponTabTitleListData} errors={errors} touched={touched} />
                </Col>
                <Col xl="7" lg="8">
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <GeneralTabContent setFieldValue={setFieldValue} values={values} />
                    </TabPane>
                    <TabPane tabId="2">
                      <RestrictionTabContent values={values} setFieldValue={setFieldValue} errors={errors} />
                    </TabPane>
                    <TabPane tabId="3">
                      <UsageTabContent values={values} />
                    </TabPane>
                    <FormBtn />
                  </TabContent>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      )}
    </Formik>
  );
};

export default CouponForm;
