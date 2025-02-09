import React, { useContext, useEffect } from "react";
import SearchableSelectInput from "../InputFields/SearchableSelectInput";
import SimpleInputField from "../InputFields/SimpleInputField";
import VariationsTab from "./VariationsTab";
import { useTranslation } from "@/app/i18n/client";
import ProductDateRangePicker from "./DateRangePicker";
import I18NextContext from "@/Helper/I18NextContext";

const InventoryTab = ({ values, setFieldValue, errors, updateId }) => {
  const { i18Lang } = useContext(I18NextContext);
    const { t } = useTranslation(i18Lang, 'common');
  // Set the value of sale price
  useEffect(() => {
    if (values['price'] || values['discount']) {
      let salePriceValue = values['price'] - ((values['price'] * values['discount']) / 100);
      setFieldValue("sale_price", salePriceValue)
    }
  }, [values['price'], values['discount']])
  return (
    <>
      <SearchableSelectInput
        nameList={[
          {
            name: "type",
            require: "true",
            inputprops: {
              name: "type",
              id: "type",
              options: [
                { id: "simple", name: "Simple" },
                // { id: "classified", name: "Classified" },
              ],
            },
          },
        ]}
      />
      <SimpleInputField nameList={[
        // { name: "unit", placeholder: t("EnterUnit(e.g10pieces)"), helpertext: "*Hãy chỉ định đơn vị đo lường, ví dụ như 10 mảnh, 1 kg, 1 lít, v.v." }, 
      {name: "weight", type: "number", placeholder: t("EnterweightGms(e.g100)"), helpertext: "*Hãy chỉ định trọng lượng của sản phẩm này bằng đơn vị gram (Gms)."}]} />
      {values["type"] === "simple" && <SearchableSelectInput
        nameList={[
          {
            name: "stock_status",
            title: "StockStatus",
            require: 'true',
            inputprops: {
              name: "stock_status",
              id: "stock_status",
              options: [
                { id: "in_stock", name: "InStock" },
                { id: "pre-order", name: "PreOrder" },
                { id: "out_of_stock", name: "OutOfStock" },
              ],
            },
          },
        ]}
      />}
      {values["type"] === "simple" && <SimpleInputField nameList={[{ name: "quantity", title: "StockQuantity", placeholder: t("EnterQuantity"), type: "number", require: "true" }, { name: "price", type: "number", inputaddon: "true", placeholder: t("EnterPrice"), require: "true" }, { name: "sale_price", title: "SalePrice", type: "number", inputaddon: "true", readOnly: 'true' }, { name: "discount", type: "number", inputaddon: "true", postprefix: "%", placeholder: t("EnterDiscount"), min: "0", max: "100" }]} />}
      <ProductDateRangePicker values={values} setFieldValue={setFieldValue} />
      {values["type"] === "classified" && <VariationsTab updateId={updateId} values={values} setFieldValue={setFieldValue} errors={errors} />}
    </>
  );
};

export default InventoryTab;
