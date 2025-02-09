import dvhcvn from './dvhcvn.json'
import { NextResponse } from 'next/server'

export async function GET() {
  console.log(dvhcvn)
  return NextResponse.json(dvhcvn)
}
