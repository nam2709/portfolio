// import coupon from './coupon.json'
import { verifyAuthorization, verifySession, verifyToken } from '@/app/actions/user'
import { NextResponse } from 'next/server'
import fs from 'fs/promises'

export async function GET() {
  const token = await verifySession()
    .then(session => session?.tokens?.idToken.toString())
    .catch(() => null)

  const coupon = await fetch(`${process.env.COUPON_API}/coupon`, {
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

  const fetchVendor = async (vendorId) => {
    console.log('vendorId',  vendorId)
    try {
      console.log('url', `${process.env.API_URL}/vendors/${vendorId}`)
      const response = await fetch(`${process.env.API_URL}/vendors/${vendorId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      return null;
    }
  };

  try {
    if (coupon?.message) {
      return NextResponse.json({ data: [] })
    } else {
      const transformedCoupons = await Promise.all(coupon.map(async (elem) => {
        const vendorInfo = await fetchVendor(elem.userId || elem.vendorId);
        console.log('vendorInfo', vendorInfo)
        return {
          id: elem?.CouponId,
          ...elem,
          creator: vendorInfo?.name || '',
        };
      }));
  
      console.log('transformedCoupons', transformedCoupons)
      return NextResponse.json({ data: transformedCoupons })
    }
  } catch (error) {
    console.error('Error writing to file:', error);
    return NextResponse.json({ data: [] })
  }
}
