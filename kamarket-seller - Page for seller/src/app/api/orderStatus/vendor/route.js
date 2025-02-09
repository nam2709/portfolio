import orderStatusVendor from './orderStatusVendor.json'
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(orderStatusVendor);
}