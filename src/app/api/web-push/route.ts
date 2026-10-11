import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: "Push Notifications API Ready" });
}