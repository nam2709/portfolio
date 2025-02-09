import media from './media.json'
import { verifyAuthorization, verifySession } from '@/app/actions/user'
import { NextResponse } from 'next/server'

export async function GET() {
  const token = await verifySession()
    .then(session => session?.tokens?.idToken.toString())
    .catch(() => null)

  const attachment = await fetch(`${process.env.API_URL}/upload`, {
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
  
  return NextResponse.json(attachment)
}
