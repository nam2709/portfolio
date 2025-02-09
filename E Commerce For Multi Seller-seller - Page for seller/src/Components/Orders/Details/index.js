import React, { useContext, useEffect, useState } from 'react'
import { OrderAPI, OrderStatusAPI, OrderStatusVenderAPI } from '../../../Utils/AxiosUtils/API';
import request from '../../../Utils/AxiosUtils';
import { useQuery } from '@tanstack/react-query';
import OrderNumberTable from './OrderNumberTable';
import { Col, Row } from 'reactstrap';
import Loader from '../../CommonComponent/Loader';
import OrderDetailsTable from './OrderDetailsTable';
import TrackingPanel from './TrackingPanel';
import RightSidebar from './RightSidebar';
import { useTranslation } from "@/app/i18n/client";
import usePermissionCheck from '../../../Utils/Hooks/usePermissionCheck';
import I18NextContext from '@/Helper/I18NextContext';
import { fetchAuthSession } from 'aws-amplify/auth';
import useSWR from 'swr';

const OrderDetailsContain = ({ updateId }) => {
    const { i18Lang } = useContext(I18NextContext);
    const { t } = useTranslation(i18Lang, 'common');
    const [edit] = usePermissionCheck(["edit"]);
    const [orderStatus, setOrderStatus] = useState("")

    
    // const { data, isLoading, refetch } = useQuery(["category/" + updateId], () => request({ url: `${OrderAPI}/${updateId}` }), { refetchOnWindowFocus: false, select: (res) => { return res.data } });
    // Getting Data from Order API for Order_Number
    async function fetchVendorOrder() {
        const token = await fetchAuthSession()
          .then(session => session)
          .catch(() => null)
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/orders/${updateId}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token?.tokens?.idToken?.toString()}`,
          },
        }).then(res => res.json())
      }
    const { data, error, isLoading, mutate } = useSWR(`/vendor/orders/${updateId}`, fetchVendorOrder)
    // Getting Data from Order Status API
    const { data: orderStatusData, refetch: orderStatusRefetch, isLoading: orderStatusLoader } = useQuery([OrderStatusAPI], () => request({ url: OrderStatusAPI }), { enabled: false, refetchOnWindowFocus: false, select: (data) => data?.data?.data });
     // Getting Data from Order vender Status API
    const { data: orderStatusVendorData, refetch: orderStatusVendorRefetch, isLoading: orderStatusVendorLoader } = useQuery([OrderStatusVenderAPI], () => request({ url: OrderStatusVenderAPI }), { enabled: false, refetchOnWindowFocus: false, select: (data) => data?.data?.data });
    useEffect(() => {
        if (data) {
            setOrderStatus(data?.order_status)
        }
    }, [isLoading, data])

    useEffect(() => {
        orderStatusRefetch()
        orderStatusVendorRefetch()
    }, [data])
    if (isLoading) return <Loader />;
    return (
        <Row>
            <Col xxl="9">
                {!data?.sub_orders?.length > 0 && <div className="mb-4">
                    <div className="tracking-panel">
                        <TrackingPanel orderStatusData={orderStatusData} orderStatus={orderStatus} />
                    </div>
                </div>}
                <Col sm="12">
                    <OrderNumberTable moduleName={`${t('OrderNumber')}: #${data?.order_number}`} updateId={updateId} data={data} orderStatusData={orderStatusVendorData} setOrderStatus={setOrderStatus} orderStatus={orderStatus} edit={edit} />
                </Col>
                {data?.sub_orders?.length > 0 &&
                    <Col sm="12">
                        <OrderDetailsTable moduleName={`OrderDetails`} data={data} />
                    </Col>
                }
            </Col >
            <Col xxl="3">
                <RightSidebar data={data} />
            </Col>
        </Row >
    )
}

export default OrderDetailsContain