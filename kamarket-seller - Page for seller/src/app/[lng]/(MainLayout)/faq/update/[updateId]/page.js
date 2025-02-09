"use client";
import FaqForm from "@/Components/Faq/FaqForm";
import FormWrapper from "@/Utils/HOC/FormWrapper";

const UpdateFaq = ({ params }) => {
  return (
    params?.updateId && (
      <FormWrapper title="Update Faq">
        <FaqForm updateId={params?.updateId} />
      </FormWrapper>
    )
  );
};

export default UpdateFaq;
