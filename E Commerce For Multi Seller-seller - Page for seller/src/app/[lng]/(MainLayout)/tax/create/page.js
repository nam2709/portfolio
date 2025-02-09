'use client'
import TaxForm from "@/Components/Tax/TaxForm";
import FormWrapper from "@/Utils/HOC/FormWrapper";

const TaxCreate = () => {
  return (
    <FormWrapper title="AddTax">
      <TaxForm  />
    </FormWrapper>
  );
};

export default TaxCreate;
