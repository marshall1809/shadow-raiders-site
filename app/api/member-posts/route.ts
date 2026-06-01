import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getSession } from '@/lib/auth'
import { getMemberSession } from '@/lib/member-auth'

async function requireAdmin() { return !!(await getSession()) }
async function requireMember() { return !!(await getMemberSession()) }

// GET — members and admins can read posts
export async function GET() {
  const isMember = await requireMember()
  const isAdmin = await requireAdmin()
  if (!isMember && !isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const db = createServiceClient()
  const { data } = await db
    .from('member_posts')
    .select('*')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })
  return NextResponse.json(data || [])
}

// POST — admin only
export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { title, body, category, pinned, created_by } = await req.json()
  const db = createServiceClient()
  const { data, error } = await db
    .from('member_posts')
    .insert([{ title, body, category: category || 'announcement', pinned: pinned || false, created_by: created_by || 'Admin' }])
    .select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// PUT — admin only
export async function PUT(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const db = createServiceClient()
  const { data, error } = await db
    .from('member_posts')
    .update({ title: body.title, body: body.body, category: body.category, pinned: body.pinned, updated_at: new Date().toISOString() })
    .eq('id', body.id)
    .select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE — admin only
export async function DELETE(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  const db = createServiceClient()
  await db.from('member_posts').delete().eq('id', id)
  return NextResponse.json({ ok: true })
}
