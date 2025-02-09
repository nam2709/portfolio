"use client";
import AttributeForm from "@/Components/Attribute/AttributeForm";
import FormWrapper from "@/Utils/HOC/FormWrapper";

const AttributeCreate = () => {
  return (
    <FormWrapper title="AddAttribute">
      <AttributeForm />
    </FormWrapper>
  );
};

export default AttributeCreate;
