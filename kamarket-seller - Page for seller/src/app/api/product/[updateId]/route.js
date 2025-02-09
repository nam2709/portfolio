import { verifyTokens } from "@/app/actions/user";
// import { fetchAuthSession } from "aws-amplify/auth/server";
// import product from "../product.json";
import { NextResponse } from "next/server";


export async function GET(_, { params }) {
  const singleProduct = params.updateId;
  const token = await verifyTokens()
    .then(tokens => tokens?.idToken?.toString())
    .catch(error => {
      console.error('GET TOKEN ERROR', error.message)
      return null
    })
  const product = await fetch(`${process.env.API_URL}/vendor/products/${singleProduct}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => res.json())

  return NextResponse.json(product);
}
