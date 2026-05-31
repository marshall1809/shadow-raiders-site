import { NextResponse } from 'next/server'
import { getMemberSession } from '@/lib/member-auth'

export async function GET() {
  const session = await getMemberSession()
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  return NextResponse.json({ username: session.username, role: session.role })
}
