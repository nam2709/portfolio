"use client";
import CurrencyForm from "@/Components/Currency/CurrencyForm";
import FormWrapper from "@/Utils/HOC/FormWrapper";

const UpdateCurrency = ({ params }) => {
  return (
    params?.updateId && (
      <FormWrapper title="Update Currency">
        <CurrencyForm updateId={params?.updateId} />
      </FormWrapper>
    )
  );
};

export default UpdateCurrency;
