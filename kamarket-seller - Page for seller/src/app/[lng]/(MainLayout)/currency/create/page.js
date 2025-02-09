"use client";
import CurrencyForm from "@/Components/Currency/CurrencyForm";
import FormWrapper from "@/Utils/HOC/FormWrapper";

const CreateCurrency = () => {
  return (
    <FormWrapper title="AddCurrency">
      <CurrencyForm />
    </FormWrapper>
  );
};

export default CreateCurrency;
