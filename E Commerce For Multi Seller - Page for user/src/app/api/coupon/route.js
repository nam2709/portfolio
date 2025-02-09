// import coupon from './coupon.json'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { verifyToken } from '@/app/actions/user'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    let token = headers().get('authorization')?.split(' ')?.pop()
    if (!token) {
      token = await verifyToken().catch(error => {
        console.error('GET TOKEN ERROR', error.message)
        return null
      })
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_COUPON_API}/coupon`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    },
    });
    const coupons = await response.json();

    const filter_coupons = coupons.filter(elem => 
      elem.status &&
      (
          (elem.is_expired && new Date(elem.end_date) > new Date()) ||
          !elem.is_expired
      ) &&
      !(elem.type === 'percentage' && elem.amount > 100)
    );
    console.log('coupons', filter_coupons); 

    return NextResponse.json(filter_coupons)

  } catch (error) {
      console.error('Error fetching coupon:', error);
  }
}
