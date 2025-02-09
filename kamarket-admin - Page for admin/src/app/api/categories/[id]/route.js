// pages/api/categories/[id]/product.js

import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/actions/user'

export async function GET(req, { params }) {
  const { id } = params;
  const fetchVendor = async (vendorId) => {
    try {
      const token = await verifyToken().catch(error => {
        console.error('GET TOKEN ERROR', error.message)
        return null
      })
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors/${vendorId}`, {
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
    const externalApiResponse = await fetch(`${process.env.API_URL}/categories/${id}/products`).then(res => res.json());;
    const approvedProducts = externalApiResponse.filter(product => product.status === "APPROVED");
    const result = await Promise.all(approvedProducts.filter(product => product.vendorId).map(async product => {
      if (product.vendorId) {
      const vendorInfo = await fetchVendor(product.vendorId);
      if (vendorInfo && Object.keys(vendorInfo).length > 0) {
        return { ...product, store: vendorInfo };
      } else {
        return null
      }
    }}));

    const resultsWithNulls = await Promise.all(result);
    const Results = resultsWithNulls.filter(result => result !== null);
    
    return NextResponse.json(Results);  // Return the enhanced product list
  } catch (error) {
    return NextResponse.json([]);  // Return an empty array on error
  }
}
