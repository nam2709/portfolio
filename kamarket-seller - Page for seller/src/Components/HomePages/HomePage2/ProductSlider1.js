import React, { useContext } from 'react'
import SimpleInputField from '../../InputFields/SimpleInputField'
import CheckBoxField from '../../InputFields/CheckBoxField'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'

const ProductSlider1 = ({ values, setFieldValue }) => {
    const { i18Lang } = useContext(I18NextContext);
    const { t } = useTranslation(i18Lang, 'common');
    return (
        <>
            <h4 className='fw-semibold mb-3 txt-primary w-100'>{t("ProductSlider")} 1</h4>
            <SimpleInputField nameList={[
                { name: `[content][main_content][section2_slider_products][product_slider_1][title]`, placeholder: t("EnterTitle"), title: "Title" },
                // { name: `[content][main_content][section2_slider_products][product_slider_1][description]`, placeholder: t("EnterDescription"), title: "Description", type: "textarea" }
            ]} />
            <CheckBoxField name={`[content][main_content][section2_slider_products][product_slider_1][status]`} title="Status" />
        </>
    )
}

export default ProductSlider1