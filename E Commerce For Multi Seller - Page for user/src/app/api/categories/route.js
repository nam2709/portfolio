import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET() {
  console.log(`Fetching categories from: ${process.env.API_URL}/categories`);
  
  try {
    const response = await fetch(`${process.env.API_URL}/categories`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    const categories = await response.json();

    console.log({ ADDRESSES: categories });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('fetch-categories-error', error?.message || error);

    return NextResponse.json([], { status: 500 });
  }
}
