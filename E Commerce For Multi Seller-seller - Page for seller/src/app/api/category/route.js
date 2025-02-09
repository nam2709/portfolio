// import category from './category.json'
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await fetch(`${process.env.API_URL}/categories`)
  .then(res => res.json())
  return NextResponse.json(categories);
}