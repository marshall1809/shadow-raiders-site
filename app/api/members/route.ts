import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getSession } from '@/lib/auth'
import { hashPassword, revokeMemberSessions } from '@/lib/member-auth'

async function requireAdmin() { return !!(await getSession()) }

// GET — list all members (admin only)
export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = createServiceClient()
  const { data } = await db
    .from('members')
    .select('id, username, role, notes, active, created_at, last_login, updated_at')
    .order('created_at', { ascending: false })
  return NextResponse.json(data || [])
}

// POST — create new member with a unique password
export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { username, password, role, notes } = await req.json()

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
  }

  const db = createServiceClient()

  // Check username not already taken
  const { data: existing } = await db
    .from('members')
    .select('id')
    .ilike('username', username.trim())
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Username already exists' }, { status: 409 })
  }

  const password_hash = await hashPassword(password)

  const { data, error } = await db
    .from('members')
    .insert([{ username: username.trim(), password_hash, role: role || 'member', notes: notes || null }])
    .select('id, username, role, notes, active, created_at')
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// PUT — update member (change role, notes, reset password, or deactivate)
export async function PUT(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { id, role, notes, active, newPassword } = body

  const db = createServiceClient()
  const updates: Record<string, unknown> = {
    role, notes: notes || null, active,
    updated_at: new Date().toISOString(),
  }

  // If resetting password, hash the new one
  if (newPassword) {
    updates.password_hash = await hashPassword(newPassword)
  }

  const { data, error } = await db
    .from('members')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // If deactivating, revoke all their sessions immediately
  if (active === false) {
    await revokeMemberSessions(id)
  }

  return NextResponse.json(data)
}

// DELETE — permanently delete member record
export async function DELETE(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  const db = createServiceClient()
  await revokeMemberSessions(id)
  await db.from('members').delete().eq('id', id)
  return NextResponse.json({ ok: true })
}
