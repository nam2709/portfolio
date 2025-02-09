
import { verifyTokens } from "@/app/actions/user";
import { NextResponse } from "next/server";

export async function GET() {
    const token = await verifyTokens()
        .then(tokens => tokens?.idToken?.toString())
        .catch(error => {
        console.error('GET TOKEN ERROR', error.message)
        return null
        })
    const product = await fetch(`${process.env.API_URL}/vendor/products`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
        })
    .then(res => res.json())
  return NextResponse.json(product);
}