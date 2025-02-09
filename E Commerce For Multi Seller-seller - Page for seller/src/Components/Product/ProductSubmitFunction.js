import { fetchAuthSession } from "aws-amplify/auth";
import allPossibleCases from "../../Utils/CustomFunctions/AllPossibleCases";

const ProductSubmitFunction = async (_, value, updateId, setResetKey) => {
  if (value["type"] == "classified") {
    delete value["stock_status"]
    delete value["quantity"]
    delete value["price"]
    delete value["sale_price"]
    delete value["discount"]
    delete value["sku"]
  }
  if (value["is_random_related_products"]) {
    value['related_products'] = []
  }
  value["is_sale_enable"] = Number(value["is_sale_enable"]);
  value["is_random_related_products"] = Number(value["is_random_related_products"]);
  value["is_free_shipping"] = Number(value["is_free_shipping"]);
  value["is_approved"] = Number(value["is_approved"]);
  value['is_featured'] = Number(value['is_featured'])
  value['safe_checkout'] = Number(value['safe_checkout'])
  value['secure_checkout'] = Number(value['secure_checkout'])
  value['social_share'] = Number(value['social_share'])
  value['encourage_order'] = Number(value['encourage_order'])
  value['encourage_view'] = Number(value['encourage_view'])
  value['is_trending'] = Number(value['is_trending'])
  value['is_return'] = Number(value['is_return'])
  value['status'] = Number(value['status'])

  value['variations'] = value?.variations?.map((elem, ind) => {
    return {
      ...elem,
      variation_image_id: elem.variation_image_id ? elem.variation_image_id : null,
      attribute_values: elem.attribute_values ? elem.attribute_values.map(el => {
        return el.id
      }) : allPossibleCases(
        value["combination"]?.map((item) => item?.values?.map((elem) => elem)))[ind]
    }
  })
    const token = await fetchAuthSession().catch(console.error)
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/products/${updateId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token?.tokens?.idToken?.toString()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(value),
      })
        .then(res => res.json())
        .catch(error => {
          console.error(error.message)
          throw error
        })
        setResetKey(true)
};

export default ProductSubmitFunction;
