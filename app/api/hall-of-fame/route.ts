import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

export const runtime = 'nodejs'

const BUCKET = 'hall-of-fame'

type HallPayload = {
  display_name: string
  role_title: string | null
  short_description: string
  biography: string | null
  avatar_url: string | null
  avatar_path: string | null
  inducted_at: string | null
  tags: string[]
  status: string | null
  sort_order: number | null
  is_public: boolean
}

async function requireAuth() { return !!(await getSession()) }

function cleanText(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value.trim() : ''
}

function optionalText(value: FormDataEntryValue | null) {
  const text = cleanText(value)
  return text.length > 0 ? text : null
}

function parseTags(value: FormDataEntryValue | null) {
  return cleanText(value)
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)
}

function parseSortOrder(value: FormDataEntryValue | null) {
  const text = cleanText(value)
  if (!text) return null
  const number = Number(text)
  return Number.isFinite(number) ? number : null
}

async function uploadAvatar(file: File) {
  const db = createServiceClient()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const filePath = `avatars/${Date.now()}-${safeName}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error } = await db.storage
    .from(BUCKET)
    .upload(filePath, buffer, { contentType: file.type || 'application/octet-stream', upsert: false })

  if (error) throw new Error(error.message)

  const { data } = db.storage.from(BUCKET).getPublicUrl(filePath)
  return { avatar_url: data.publicUrl, avatar_path: filePath }
}

async function payloadFromForm(formData: FormData, existingAvatarPath: string | null = null): Promise<HallPayload> {
  const display_name = cleanText(formData.get('display_name'))
  const short_description = cleanText(formData.get('short_description'))

  if (!display_name || !short_description) {
    throw new Error('Display name and short description are required.')
  }

  let avatar_url = optionalText(formData.get('avatar_url'))
  let avatar_path: string | null = existingAvatarPath
  const file = formData.get('avatar_file')

  if (file instanceof File && file.size > 0) {
    const uploaded = await uploadAvatar(file)
    avatar_url = uploaded.avatar_url
    avatar_path = uploaded.avatar_path
  }

  return {
    display_name,
    role_title: optionalText(formData.get('role_title')),
    short_description,
    biography: optionalText(formData.get('biography')),
    avatar_url,
    avatar_path,
    inducted_at: optionalText(formData.get('inducted_at')),
    tags: parseTags(formData.get('tags')),
    status: optionalText(formData.get('status')),
    sort_order: parseSortOrder(formData.get('sort_order')),
    is_public: cleanText(formData.get('is_public')) === 'true',
  }
}

export async function GET(req: NextRequest) {
  const includeHidden = req.nextUrl.searchParams.get('includeHidden') === '1'
  const isAdmin = await requireAuth()

  if (includeHidden && !isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = createServiceClient()
  let query = db
    .from('hall_of_fame_profiles')
    .select('*')
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('inducted_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (!includeHidden) query = query.eq('is_public', true)

  const { data, error } = await query
  if (error) {
    if (!includeHidden) return NextResponse.json([])
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const payload = await payloadFromForm(formData)
    const db = createServiceClient()
    const { data, error } = await db.from('hall_of_fame_profiles').insert([payload]).select()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid request.' }, { status: 400 })
  }
}

export async function PUT(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const id = cleanText(formData.get('id'))
    if (!id) return NextResponse.json({ error: 'Profile id is required.' }, { status: 400 })

    const existingAvatarPath = optionalText(formData.get('avatar_path'))
    const payload = await payloadFromForm(formData, existingAvatarPath)
    const db = createServiceClient()
    const { data, error } = await db
      .from('hall_of_fame_profiles')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid request.' }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, avatar_path } = await req.json()
  if (!id) return NextResponse.json({ error: 'Profile id is required.' }, { status: 400 })

  const db = createServiceClient()
  if (avatar_path) await db.storage.from(BUCKET).remove([avatar_path])
  const { error } = await db.from('hall_of_fame_profiles').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
