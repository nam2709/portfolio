"use client";
import TagForm from "@/Components/Tag/TagForm";
import FormWrapper from "@/Utils/HOC/FormWrapper";

const TagsCreate = () => {
  return (
    <FormWrapper title="AddTag">
      <TagForm type={"product"} />
    </FormWrapper>
  );
};

export default TagsCreate;
