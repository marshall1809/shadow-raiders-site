import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

async function requireAuth() { return !!(await getSession()) }

export async function GET() {
  const db = createServiceClient()
  const { data } = await db.from('leadership').select('*').order('rank_order')
  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const db = createServiceClient()
  const { data, error } = await db.from('leadership').insert([{
    rank_order: body.rank_order, name: body.name, rank_title: body.rank_title,
    role_title: body.role_title, bio: body.bio, badge_text: body.badge_text || null,
  }]).select()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const db = createServiceClient()
  const { data, error } = await db.from('leadership').update({
    rank_order: body.rank_order, name: body.name, rank_title: body.rank_title,
    role_title: body.role_title, bio: body.bio, badge_text: body.badge_text || null,
    updated_at: new Date().toISOString(),
  }).eq('id', body.id).select()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  const db = createServiceClient()
  await db.from('leadership').delete().eq('id', id)
  return NextResponse.json({ ok: true })
}
