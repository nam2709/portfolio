import { useContext } from "react";
import { useTranslation } from "@/app/i18n/client";
import { Form, Formik } from "formik";
import FileUploadField from "../InputFields/FileUploadField";
import { Row } from "reactstrap";
import SimpleInputField from "../InputFields/SimpleInputField";
import AddressComponent from "../InputFields/AddressComponent";
import CheckBoxField from "../InputFields/CheckBoxField";
import FormBtn from "../../Elements/Buttons/FormBtn";
import AccountContext from "../../Helper/AccountContext";
import { YupObject, emailSchema, nameSchema, phoneSchema } from "../../Utils/Validation/ValidationSchemas";
import I18NextContext from "@/Helper/I18NextContext";
import useSWR from "swr";
import { fetchAuthSession } from "aws-amplify/auth";
import { ToastNotification } from "@/Utils/CustomFunctions/ToastNotification";

async function fetchVendorOrder() {
    const token = await fetchAuthSession()
      .then(session => session)
      .catch(() => null)
  
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors/${token?.userSub}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token?.tokens?.idToken?.toString()}`,
      },
    }).then(res => res.json())
  }


const VendorProfile = () => {
    const { i18Lang } = useContext(I18NextContext);
    const { t } = useTranslation(i18Lang, 'common');
    const { accountData } = useContext(AccountContext)
    const { data, error, isLoading, mutate } = useSWR(`/vendors`, fetchVendorOrder)
    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error...{error}</div>
    return (
        <Formik
            enableReinitialize
            initialValues={{
                name: data?.name ?? "",
                email: data?.email ?? "",
                phone: `0${data?.phone}` ?? "",
                description: data?.description ?? "",
                city: data?.city ?? "",
                address: data?.address ?? "",
                facebook: data?.facebook ?? "",
                twitter: data?.twitter ?? "",
                instagram: data?.instagram ?? "",
                youtube: data?.youtube ?? "",
                store_logo_id: data?.store_logo_id ?? '',
                store_logo: data?.store_logo ?? '',
                hide_vendor_email: data?.hide_vendor_email ? Boolean(data?.hide_vendor_email) : true,
                hide_vendor_phone: data?.hide_vendor_phone ? Boolean(data?.hide_vendor_phone) : true
            }}
            validationSchema={YupObject({
                name: nameSchema,
                description: nameSchema,
                city: nameSchema,
                address: nameSchema,
                email: emailSchema,
                phone: phoneSchema,
                // pincode: nameSchema,
            })}
            onSubmit={ async (values) => {
                // delete values["store_logo"];
                // delete values["address"]
                if (values['store_logo_id'] == undefined) values['store_logo_id'] = null
                values["hide_vendor_phone"] = Number(values["hide_vendor_phone"]);
                values["hide_vendor_email"] = Number(values["hide_vendor_email"]);
                // Put Add Or Update Logic Here
                const token = await fetchAuthSession().catch(console.error)
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor`, {
                    method: 'PUT',
                    headers: {
                    Authorization: `Bearer ${token?.tokens?.idToken?.toString()}`,
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            ...values
                        }),
                })
                    .then(res => ToastNotification("success", t("UpdateSuccess")))
                    .catch(error => {
                    console.error(error.message)
                    throw error
                })
            }}>
            {({ setFieldValue, values, errors, touched }) => (
                <Form className="theme-form theme-form-2 mega-form">
                    <Row>
                        <FileUploadField values={values} setFieldValue={setFieldValue} title="StoreLogo" type="file" id="store_logo_id" name="store_logo_id" errors={errors} touched={touched} />
                        <SimpleInputField nameList={[{ name: "name", placeholder: t("EnterStoreName"), require: "true" },
                         { name: "email", title: "Email", type: "email", placeholder: t("EnterEmail"), require: "true" },
                         { name: "phone", title: "Phone", type: "number", placeholder: t("EnterPhone"), require: "true" },
                         { name: "description", title: "StoreDescription", type: "textarea", placeholder: t("EnterDescription"), require: "true" }]} />
                        <AddressComponent values={values} />
                        <SimpleInputField nameList={[
                            { name: "facebook", type: "url", placeholder: t("EnterFacebookurl") },
                            { name: "instagram", type: "url", placeholder: t("EnterInstagramurl") },
                            { name: "twitter", type: "url", placeholder: t("EnterTwitterurl") },
                            { name: "youtube", type: "url", placeholder: t("EnterYoutubeurl") },
                        ]} />
                        {/* <CheckBoxField name="hide_vendor_email" title="HideEmail" />
                        <CheckBoxField name="hide_vendor_phone" title="HidePhone" /> */}
                        <FormBtn />
                    </Row>
                </Form>
            )}
        </Formik>
    )
}

export default VendorProfile