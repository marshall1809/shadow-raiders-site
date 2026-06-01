import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getSession } from '@/lib/auth'
import { getMemberSession } from '@/lib/member-auth'

async function requireAdmin() { return !!(await getSession()) }
async function requireMember() { return !!(await getMemberSession()) }

// GET — list files (members and admins)
export async function GET() {
  const isMember = await requireMember()
  const isAdmin = await requireAdmin()
  if (!isMember && !isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const db = createServiceClient()
  const { data } = await db
    .from('member_files')
    .select('*')
    .order('created_at', { ascending: false })
  return NextResponse.json(data || [])
}

// POST — upload file metadata + get signed upload URL (admin only)
export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string

  if (!file || !name) {
    return NextResponse.json({ error: 'File and name required' }, { status: 400 })
  }

  const db = createServiceClient()
  const fileExt = file.name.split('.').pop()
  const filePath = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`

  // Upload to Supabase Storage
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error: uploadError } = await db.storage
    .from('member-files')
    .upload(filePath, buffer, { contentType: file.type, upsert: false })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  // Get public URL (signed URL since bucket is private)
  const { data: urlData } = await db.storage
    .from('member-files')
    .createSignedUrl(filePath, 60 * 60 * 24 * 7) // 7 days

  const fileUrl = urlData?.signedUrl || ''

  // Save metadata to DB
  const { data, error } = await db
    .from('member_files')
    .insert([{
      name, description: description || null,
      file_path: filePath, file_url: fileUrl,
      file_type: file.type, file_size: file.size,
      category: category || 'general',
    }])
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE — admin only
export async function DELETE(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, file_path } = await req.json()
  const db = createServiceClient()

  // Delete from storage
  if (file_path) {
    await db.storage.from('member-files').remove([file_path])
  }

  await db.from('member_files').delete().eq('id', id)
  return NextResponse.json({ ok: true })
}

// GET signed URL for a specific file (fresh URL on demand)
export async function PUT(req: NextRequest) {
  const isMember = await requireMember()
  const isAdmin = await requireAdmin()
  if (!isMember && !isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { file_path } = await req.json()
  const db = createServiceClient()
  const { data } = await db.storage
    .from('member-files')
    .createSignedUrl(file_path, 3600) // 1 hour
  return NextResponse.json({ url: data?.signedUrl || '' })
}
