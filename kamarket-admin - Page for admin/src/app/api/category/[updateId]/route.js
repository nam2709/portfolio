// import category from '../category.json'
import { verifyAuthorization, verifySession } from '@/app/actions/user'
import { NextResponse } from 'next/server'

export async function GET(_, { params }) {
  const singleCategory = params.updateId
  const token = await verifySession()
    .then(session => session?.tokens?.idToken.toString())
    .catch(() => null)

  const langCode = decodeURIComponent(singleCategory).match(/\.lang=([a-zA-Z-]+)/)?.[1];
  const cleanCategoryId = singleCategory.split('.lang=')[0];
  let baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/category/${cleanCategoryId}`;
  if (langCode) {
      baseUrl += `?lang=${langCode}`;
  }

  console.log('baseUrl', baseUrl);

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
      return {}
  })
  console.log('category', category)

  try {
    if (category?.message) {
      return NextResponse.json({})
    } else {
      if (category.translations) {
        category.name = category.translations.name || category.name;
        category.description = category.translations.description || category.description;
      }
      return NextResponse.json(category)
    }
  } catch (error) {
    console.error('Error writing to file:', error);
    return NextResponse.json({})
  }
}
