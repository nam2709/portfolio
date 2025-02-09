"use client";
import AttributeForm from "@/Components/Attribute/AttributeForm";
import FormWrapper from "@/Utils/HOC/FormWrapper";

const UpdateAttributes = ({ params }) => {
  return (
    params?.updateId && (
      <FormWrapper title="UpdateAttribute">
        <AttributeForm updateId={params?.updateId} />
      </FormWrapper>
    )
  );
};

export default UpdateAttributes;
