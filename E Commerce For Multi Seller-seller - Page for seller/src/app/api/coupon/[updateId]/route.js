import coupon from '../coupon.json'
import { NextResponse } from 'next/server'
import { verifyAuthorization, verifySession } from '@/app/actions/user'

export async function GET(_, { params }) {
  const singleCoupon = params.updateId

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

  const coupons = { data: coupon }

  const couponObj = coupons?.data.find(elem => elem.CouponId == singleCoupon)

  return NextResponse.json(couponObj)
}