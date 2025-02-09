"use client";
import ProductForm from "@/Components/Product/ProductForm";
import { useState } from "react";

const UpdateProduct = ({ params }) => {
  const [resetKey, setResetKey] = useState(false);

  return (
    params?.updateId && (
      <ProductForm
        setResetKey={setResetKey}
        updateId={params?.updateId}
        title={"EditProduct"}
        key={resetKey}
      />
    )
  );
};

export default UpdateProduct;
