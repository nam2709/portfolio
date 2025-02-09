"use client";
import UserForm from "@/Components/User/UserForm";
import FormWrapper from "@/Utils/HOC/FormWrapper";

const UserUpdate = ({ params }) => {
  return (
    params?.updateId && (
      <FormWrapper title="UpdateUser">
        <UserForm updateId={params?.updateId} />
      </FormWrapper>
    )
  );
};

export default UserUpdate;
