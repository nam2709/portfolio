"use client";
import PageForm from "@/Components/Pages/PageForm";
import FormWrapper from "@/Utils/HOC/FormWrapper";

const UpdatePage = ({ params }) => {
  return (
    params?.updateId && (
      <FormWrapper title="Update Page">
        <PageForm updateId={params?.updateId} />
      </FormWrapper>
    )
  );
};

export default UpdatePage;
