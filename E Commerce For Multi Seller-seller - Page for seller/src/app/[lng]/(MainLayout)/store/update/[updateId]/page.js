"use client";

import StoreForm from "@/Components/Store/StoreForm";
import FormWrapper from "@/Utils/HOC/FormWrapper";

const StoreUpdate = ({ params }) => {
  return (
    params?.updateId && (
      <FormWrapper title="UpdateStore">
        <StoreForm updateId={params?.updateId} />
      </FormWrapper>
    )
  );
};

export default StoreUpdate;
