import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

async function requireAuth() { return !!(await getSession()) }

export async function GET() {
  const db = createServiceClient()
  const { data } = await db.from('results').select('*').order('date', { ascending: false })
  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const db = createServiceClient()
  const { data, error } = await db.from('results').insert([{
    date: body.date, competition: body.competition, title: body.title,
    opponent: body.opponent, our_score: body.our_score ?? null,
    their_score: body.their_score ?? null, outcome: body.outcome || null, notes: body.notes || null,
  }]).select()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const db = createServiceClient()
  const { data, error } = await db.from('results').update({
    date: body.date, competition: body.competition, title: body.title,
    opponent: body.opponent, our_score: body.our_score ?? null,
    their_score: body.their_score ?? null, outcome: body.outcome || null,
    notes: body.notes || null, updated_at: new Date().toISOString(),
  }).eq('id', body.id).select()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  const db = createServiceClient()
  await db.from('results').delete().eq('id', id)
  return NextResponse.json({ ok: true })
}
