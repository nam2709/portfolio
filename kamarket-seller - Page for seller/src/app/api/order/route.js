import { verifyTokens } from '@/app/actions/user';
import order from './order.json'
import { NextResponse } from "next/server";

// export const config = {
//     api: {
//         responseLimit: '8mb',
//     },
// }
// export async function GET() {
//   return NextResponse.json(order);
// }
export async function GET() {
  const token = await verifyTokens()
        .then(tokens => tokens?.idToken?.toString())
        .catch(error => {
        console.error('GET TOKEN ERROR', error.message)
        return null
        })
    const orders = await fetch(`${process.env.API_URL}/vendor/orders`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
        })
    .then(res => res.json())
  return NextResponse.json(orders);
}
