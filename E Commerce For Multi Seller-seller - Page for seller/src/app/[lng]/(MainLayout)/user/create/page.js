"use client";

import UserForm from "@/Components/User/UserForm";
import FormWrapper from "@/Utils/HOC/FormWrapper";

const AddNewUser = () => {
  return (
    <FormWrapper title="AddUser">
      <UserForm />
    </FormWrapper>
  );
};

export default AddNewUser;
