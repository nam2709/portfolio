import { useQuery } from "@tanstack/react-query";
import request from "../../Utils/AxiosUtils";
import { tax } from "../../Utils/AxiosUtils/API";
import CheckBoxField from "../InputFields/CheckBoxField";
import SearchableSelectInput from "../InputFields/SearchableSelectInput";
import SimpleInputField from "../InputFields/SimpleInputField";
import { useTranslation } from "@/app/i18n/client";
import { useContext } from "react";
import I18NextContext from "@/Helper/I18NextContext";

const ShippingTaxTab = () => {
  const { i18Lang } = useContext(I18NextContext);
    const { t } = useTranslation(i18Lang, 'common');
  const { data: taxData } = useQuery([tax], () => request({ url: tax, params: { status: 1 } }), { refetchOnWindowFocus: false, select: (data) => data.data.data });
  return (
    <>
      <CheckBoxField name="is_free_shipping" title="FreeShipping" />
      <CheckBoxField name="ship_express" title="ShippingExpress" />
      {/* <SearchableSelectInput
        nameList={[
          {
            name: "tax_id",
            title: "Tax",
            require: "true",
            inputprops: {
              name: "tax_id",
              id: "tax_id",
              options: taxData || [],
            },
          },
        ]}
      /> */}
      <SimpleInputField nameList={[{
        name: "estimated_delivery_text", placeholder: t("EnterEstimatedDeliveryText"), title: "EstimatedDeliveryText", helpertext: "*Chỉ định văn bản giao hàng, ví dụ: Đơn đặt hàng của bạn có thể sẽ đến tay bạn trong vòng 3 đến 4 ngày."
      }, { name: "return_policy_text", placeholder: t("EnterReturnPolicyText"), title: "ReturnPolicyText", helpertext: "*Chỉ định văn bản trả hàng, ví dụ: Có thể có các tùy chọn trả hàng dễ dàng trong vòng 7, 15 và 30 ngày." }]} />
    </>
  );
};

export default ShippingTaxTab;
