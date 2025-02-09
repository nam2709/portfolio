import { NextResponse } from 'next/server'

export async function GET(req) {
  const url = new URL(req.url)
  const product_id = url.searchParams.get('product_id')

  try {
    const reviewResponse = await fetch(`${process.env.NEXT_PUBLIC_REVIEW_API}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId: product_id })
    });

    const generalResponse = await fetch(`${process.env.NEXT_PUBLIC_REVIEW_API}/general-review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId: product_id })
    });

    if (!reviewResponse.ok || !generalResponse.ok) {
      throw new Error('Failed to fetch data');
    }

    const reviewData = await reviewResponse.json();
    const generalData = await generalResponse.json();

    const review = {
      review: reviewData,
      general: generalData
    };

    console.log('review', review)
    
    return NextResponse.json(review);
  } catch (error) {
    console.error('Fetch error:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch review' }), { status: 500 });
  }
}