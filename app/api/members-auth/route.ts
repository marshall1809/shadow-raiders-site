import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { verifyPassword, createMemberSession, MEMBER_COOKIE } from '@/lib/member-auth'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
    }

    const db = createServiceClient()

    // Find member by username (case-insensitive)
    const { data: member } = await db
      .from('members')
      .select('id, username, password_hash, role, active')
      .ilike('username', username.trim())
      .single()

    if (!member || !member.active) {
      // Generic error — don't reveal whether username exists
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const valid = await verifyPassword(password, member.password_hash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await createMemberSession(member.id, member.username)

    const res = NextResponse.json({ ok: true, username: member.username, role: member.role })
    res.cookies.set(MEMBER_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 72, // 72 hours
      path: '/',
    })
    return res
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(MEMBER_COOKIE)
  return res
}
