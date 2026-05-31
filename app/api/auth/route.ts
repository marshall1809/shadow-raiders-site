import { NextRequest, NextResponse } from 'next/server'
import { createSession, COOKIE_NAME } from '@/lib/auth'

export async function POST(req: NextRequest) {
  // Handle sign-out via form method override
  const contentType = req.headers.get('content-type') || ''
  if (contentType.includes('application/x-www-form-urlencoded')) {
    const body = await req.text()
    if (body.includes('_method=DELETE')) {
      const res = NextResponse.redirect(new URL('/admin', req.url))
      res.cookies.delete(COOKIE_NAME)
      return res
    }
  }

  // Handle login
  const { password } = await req.json()
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const token = await createSession()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24h
    path: '/',
  })
  return res
}
