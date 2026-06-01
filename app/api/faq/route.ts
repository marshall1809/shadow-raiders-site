import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

async function requireAuth() { return !!(await getSession()) }

export async function GET() {
  const db = createServiceClient()
  const { data } = await db.from('faq').select('*').order('sort_order')
  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const db = createServiceClient()
  const { data, error } = await db.from('faq').insert([{
    sort_order: body.sort_order, question: body.question, answer: body.answer,
  }]).select()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const db = createServiceClient()
  const { data, error } = await db.from('faq').update({
    sort_order: body.sort_order, question: body.question, answer: body.answer,
    updated_at: new Date().toISOString(),
  }).eq('id', body.id).select()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  const db = createServiceClient()
  await db.from('faq').delete().eq('id', id)
  return NextResponse.json({ ok: true })
}
