// import category from './category.json'
import { verifyAuthorization, verifySession } from '@/app/actions/user'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const token = await verifySession()
    .then(session => session?.tokens?.idToken.toString())
    .catch(() => null)

  const { searchParams } = new URL(request.url)
  const lang = searchParams.get('lang')
  console.log('lang', lang)

  let baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/categories`
  if (lang) {
    baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/categories?lang=${lang}`
  }

  console.log('baseUrl', baseUrl)
  const category = await fetch(baseUrl, {
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

  try {
    if (category?.message) {
      return NextResponse.json({ data: [] })
    } else {
      const transformedCategories = category.map(elem => ({
        id: elem?.categoryId,
        ...elem
      }));
      console.log('transformedCategories', transformedCategories)
      return NextResponse.json({ data: transformedCategories })
    }
  } catch (error) {
    console.error('Error writing to file:', error);
    return NextResponse.json({ data: [] })
  }
}
