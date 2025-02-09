// import coupon from './coupon.json'
import { verifyAuthorization, verifySession } from '@/app/actions/user'
import { NextResponse } from 'next/server'
import fs from 'fs/promises'

export async function GET() {
  const token = await verifySession()
    .then(session => session?.tokens?.idToken.toString())
    .catch(() => null)

  const coupon = await fetch(`${process.env.COUPON_API}/vendor/coupon`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .catch(error => {
      console.error(error.message)
      return []
  })

  console.log('coupon', coupon)

  try {
    if (coupon?.message) {
      return NextResponse.json({ data: [] })
    } else {
      const transformedCoupons = coupon.map(elem => ({
        id: elem?.CouponId,
        ...elem
      }));
      return NextResponse.json({ data: transformedCoupons })
    }
  } catch (error) {
    console.error('Error writing to file:', error);
    return NextResponse.json({ data: [] })
  }
}