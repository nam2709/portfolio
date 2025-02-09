import { NextResponse } from 'next/server'

export async function GET(request) {
  const searchParams = request.nextUrl?.searchParams
  const categories = searchParams.get('categories')
  console.log({ CATEGORY: categories })
  //   return NextResponse.json([])
  return await fetch(`${process.env.API_PROD_URL}/collections?categories=${categories}`)
    .then(res => res.json())
    .then(data => {
      console.log({ CATEGORIES: data })
      return NextResponse.json(data)
    })
    .catch(error => {
      console.error('FAILED to fetch collections', error.message)
      return new NextResponse.json('Failed to fetch collections', { status: 500 })
    })
}
