import I18NextContext from "@/Helper/I18NextContext";
import { useTranslation } from "@/app/i18n/client";
import React, { useContext } from 'react'
import { Card, CardBody } from 'reactstrap'

const ConsumerDetails = ({ data }) => {
    const { i18Lang } = useContext(I18NextContext);
    const { t } = useTranslation(i18Lang, 'common');
    return (
        <Card>
            <CardBody>
                <div className="title-header" >
                    <div className="d-flex align-items-center">
                        <h5>{t("ConsumerDetails")}</h5>
                    </div>
                </div>
                <div className="customer-detail tracking-wrapper">
                    <ul>
                        <li>
                            <label>{t("Name")}:</label>
                            <h4>{data?.consumer?.name}</h4>
                        </li>
                        <li>
                            <label>{t("EmailAddress")}:</label>
                            <h4>{data?.consumer?.email}</h4>
                        </li>
                        <li>
                            <label>{t("ShippingAddress")}:</label>
                            <h4>
                                {data?.shipping_address?.street} - {data?.shipping_address?.ward} - {data?.shipping_address?.district} - {data?.shipping_address?.city}
                            </h4>
                        </li>
                        {data?.delivery_description && <li>
                            <label>{t("DeliverySlot")}:</label>
                            <h4>{data?.delivery_description}</h4>
                        </li>}
                        <li>
                            <label>{t("PaymentMode")}:</label>
                            <h4>{data?.payment_method?.toUpperCase()}</h4>
                        </li>
                    </ul>
                </div>
            </CardBody>
        </Card >
    )
}

export default ConsumerDetails