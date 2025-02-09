import { useContext, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import TableWarper from '../../Utils/HOC/TableWarper'
import ShowTable from '../Table/ShowTable'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'

const AllOrdersTable = ({ data, ...props }) => {
    const { i18Lang } = useContext(I18NextContext);
    const { t } = useTranslation(i18Lang, 'common');
    const router = useRouter()
    const getSpanTag = (number) => {
        return <span className="fw-bolder">#{number}</span>;
    };
    const sortedData = data && data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const headerObj = {
        checkBox: false,
        isOption: true,
        optionHead: { title: "Action", type: 'View', redirectUrl: "/order/details", modalTitle: t("Orders") },
        column: [
            { title: "OrderNumber", apiKey: "order_number" },
            { title: "OrderDate", apiKey: "created_at", sorting: true, sortBy: "desc", type: "date" },
            { title: "CustomerName", apiKey: "consumer", subKey: ["name"] },
            { title: "TotalAmount", apiKey: "total", type: 'price' },
            { title: "PaymentStatus", apiKey: "status" },
            { title: "PaymentMode", apiKey: "payment_method" }
        ],
        data: sortedData || []
    };
    let orders = useMemo(() => {
        return headerObj?.data?.filter((element) => {
            element.order_number = getSpanTag(element.order_number);
            element.status = element.status ? <div className={`status-${element?.status.toString().toLowerCase() || ''}`}><span>{t(element?.status)}</span></div> : '-';
            element.payment_mode = element.payment_method ? <div className="payment-mode"><span>{element?.payment_method}</span></div> : '-';
            // element.consumer_name = <span className="text-capitalize">{element.consumer.name}</span>;
            return element;
        });
    }, [headerObj?.data]);
    headerObj.data = headerObj ? orders : [];
    const redirectLink = (data) => {
        const order_number = data?.order_number?.props?.children?.[1]
        router.push(`/${i18Lang}/order/details/${order_number}`)
    }
    if (!data) return null;
    return (
        <>
            <ShowTable {...props} headerData={headerObj} redirectLink={redirectLink} />
        </>
    )
}

export default TableWarper(AllOrdersTable)