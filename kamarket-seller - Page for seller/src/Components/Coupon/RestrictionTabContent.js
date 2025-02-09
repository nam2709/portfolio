import { useQuery, useEffect } from "@tanstack/react-query";
import React, { useContext } from "react";
import request from "../../Utils/AxiosUtils";
import { product } from "../../Utils/AxiosUtils/API";
import CheckBoxField from "../InputFields/CheckBoxField";
import MultiSelectField from "../InputFields/MultiSelectField";
import I18NextContext from "@/Helper/I18NextContext";
import SimpleInputField from "../InputFields/SimpleInputField";
import { useTranslation } from "@/app/i18n/client";

const RestrictionTabContent = ({ values, setFieldValue, errors }) => {
  const { i18Lang } = useContext(I18NextContext);
    const { t } = useTranslation(i18Lang, 'common');
  const { data: productList } = useQuery([product], () => request({ url: product }), {
    select: (data) => data.data.map((elem) => ({ id: elem.id, name: elem.name }))
  });
  return (
    <>
      {/* <CheckBoxField name="is_apply_all" title="ApplyToAllProducts" /> */}
      {
        values["is_apply_all"] ?
          <MultiSelectField errors={errors} setFieldValue={setFieldValue} values={values} name="exclude_products" data={productList} />
          :
          <MultiSelectField errors={errors} setFieldValue={setFieldValue} values={values} name="products" title="IncludeProducts" data={productList} require="true" />
      }
      <SimpleInputField
        nameList={[{ name: "min_spend", type: "number", placeholder: t("EnterMinimumSpend"), inputaddon: "true", title: "MinimumSpend", require: "true", helpertext: "*Define the minimum order value needed to utilize the coupon." }]} />
    </>
  );
};

export default RestrictionTabContent;
