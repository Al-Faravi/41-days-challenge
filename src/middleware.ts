import { NextResponse } from 'next/server'

// Middleware পুরোপুরি বাইপাস করা হলো
export async function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: [], // 
}