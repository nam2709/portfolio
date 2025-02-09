import { NextResponse } from 'next/server'
import allStore from '../../store.json'
import { ConsoleLogger } from 'aws-amplify/utils';

export async function GET(_, { params }) {
  const singleStore = params.singleStore

  // console.log('paramsparams', params)
  // const singleStoreObj = allStore.data?.find(elem => elem?.slug == singleStore)
  try {
    const store = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors/${singleStore}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    const store_body = await store.json()
    // console.log('storestorestorestorestore', store_body)
    const data = {
      ...store_body,
      store_name: store_body.name
    }
    return NextResponse.json(data)

  } catch (error) {
    console.error('FAILED to fetch stores', error.message)
    return new NextResponse.json('Failed to fetch stores', { status: 500 })
  }
}
