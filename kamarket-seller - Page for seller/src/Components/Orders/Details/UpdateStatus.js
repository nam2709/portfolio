import { fetchAuthSession } from 'aws-amplify/auth'
import SearchableSelectInput from '../../InputFields/SearchableSelectInput'
import { ToastNotification } from '@/Utils/CustomFunctions/ToastNotification'
import I18NextContext from '@/Helper/I18NextContext';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { mutate } from "swr"



const UpdateStatus = ({ orderStatusData, setFieldValue, orderStatus, updateId }) => {
    const { i18Lang } = useContext(I18NextContext);
    const { t } = useTranslation(i18Lang, 'common');
    const router = useRouter();
    const getOrder = async () => {
        const token = await fetchAuthSession().catch(console.error)
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/orders/${updateId}`, {
        method: 'GET',
        headers: {
        Authorization: `Bearer ${token?.tokens?.idToken?.toString()}`,
        'Content-Type': 'application/json',
        }
    }).then(res => res.json())}

    const onStatusChange = async (name, value) => {
        setFieldValue('order_status_id', value)
        const token = await fetchAuthSession().catch(console.error)
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/orders/${updateId}`, {
        method: 'PUT',
        headers: {
        Authorization: `Bearer ${token?.tokens?.idToken?.toString()}`,
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                status: value.slug.toUpperCase()
            }),
    })
        .then(res => {
            return getOrder()
        }).then(updatedOrder => {
            mutate(`/vendor/orders/${updateId}`, updatedOrder)
        })
        .catch(error => {
        console.error(error.message)
        throw error
    })
    }
    return (
        <>
            <SearchableSelectInput
                nameList={[
                    {
                        name: "order_status_id",
                        notitle: "true",
                        inputprops: {
                            name: "order_status_id",
                            id: "order_status_id",
                            options: orderStatusData || [],
                            value: orderStatus ? t(orderStatus?.name) : '',
                        },
                        store: "obj",
                        setvalue: onStatusChange,
                    },
                ]}
            />
        </>
    )
}

export default UpdateStatus