"use client";
import { useState } from "react";
import { Col } from "reactstrap";
import AllProductTable from "@/Components/Product/AllProductTable";
import { product } from "@/Utils/AxiosUtils/API";
import useSWR from 'swr'
import { fetchAuthSession } from "aws-amplify/auth";
import Loader from "@/Components/CommonComponent/Loader";

async function fetchVendorProduct() {
  const token = await fetchAuthSession()
    .then(session => session?.tokens?.idToken?.toString())
    .catch(() => null)

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/products`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.json())
  // .catch(error => {
  //   console.error('FAILED to get addresses', error)
  //   return []
  // })
}


const AllUsers = () => {
  const [isCheck, setIsCheck] = useState([]);
  const { data, error, isLoading, mutate } = useSWR(`/vendor/products`, fetchVendorProduct)

  return (
    <Col sm="12">
      <AllProductTable
        products={data}
        url={product}
        moduleName="Product"
        isCheck={isCheck}
        setIsCheck={setIsCheck}
        isReplicate={{ title: "Duplicate", replicateAPI: "replicate" }}
      />
    </Col>
  );
};

export default AllUsers;
