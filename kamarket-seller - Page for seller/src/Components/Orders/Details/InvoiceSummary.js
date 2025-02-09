import Link from 'next/link'
import React, { useContext } from 'react'
import { RiDownload2Fill } from 'react-icons/ri'
import SettingContext from '../../../Helper/SettingContext'
import { Card, CardBody } from 'reactstrap'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import { formatCurrency } from '@/Utils/libs'

const InvoiceSummary = ({ data }) => {
    const { i18Lang } = useContext(I18NextContext);
    const { t } = useTranslation(i18Lang, 'common');
    const { convertCurrency } = useContext(SettingContext)
    return (
        <Card>
            <CardBody>
                <div className="title-header" >
                    <div className="d-flex align-items-center">
                        <h5>{t("Summary")}</h5>
                    </div>
                    {data?.invoice_url && <Link href={data?.invoice_url} className="btn btn-animation btn-sm ms-auto">{("Invoice")} <RiDownload2Fill /></Link>}
                </div>
                <div className="tracking-total tracking-wrapper">
                    <ul>
                        <li>{t("Subtotal")} :<span className='span-text-price'>{formatCurrency(data?.amount)}</span></li>
                        <li>{t("Shipping")} :<span className='span-text-price'>{formatCurrency(data?.shipping_total ?? 0)}</span></li>
                        <li>{t("Tax")} :<span className='span-text-price'>{formatCurrency(data?.tax_total ?? 0)}</span></li>
                        {data?.points_amount ? <li className="txt-primary fw-bold">{t("Points")} <span className='span-text-price'>{formatCurrency(data?.points_amount)}</span></li> : ""}
                        {data?.wallet_balance ? <li className="txt-primary fw-bold">{t("WalletBalance")} <span className='span-text-price'>{formatCurrency(data?.wallet_balance)}</span></li> : ""}
                        <li>{t("Total")} <span className='span-text-price'>{formatCurrency(data?.total ?? 0)}</span></li>
                    </ul>
                </div>
            </CardBody>
        </Card >
    )
}

export default InvoiceSummary