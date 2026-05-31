import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

async function requireAuth() {
  const session = await getSession()
  if (!session) return false
  return true
}

export async function GET() {
  const db = createServiceClient()
  const { data } = await db.from('schedule').select('*').order('date')
  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const db = createServiceClient()
  const { data, error } = await db.from('schedule').insert([{
    date: body.date, time_gmt: body.time_gmt, competition: body.competition,
    title: body.title, opponent: body.opponent, status: body.status, notes: body.notes || null,
  }]).select()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const db = createServiceClient()
  const { data, error } = await db.from('schedule').update({
    date: body.date, time_gmt: body.time_gmt, competition: body.competition,
    title: body.title, opponent: body.opponent, status: body.status, notes: body.notes || null,
    updated_at: new Date().toISOString(),
  }).eq('id', body.id).select()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  const db = createServiceClient()
  await db.from('schedule').delete().eq('id', id)
  return NextResponse.json({ ok: true })
}
