'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { HallOfFameProfile } from '@/lib/types'

type HallForm = {
  display_name: string
  role_title: string
  short_description: string
  biography: string
  avatar_url: string
  inducted_at: string
  tags: string
  status: string
  sort_order: string
  is_public: boolean
}

const EMPTY: HallForm = {
  display_name: '',
  role_title: '',
  short_description: '',
  biography: '',
  avatar_url: '',
  inducted_at: '',
  tags: '',
  status: '',
  sort_order: '',
  is_public: true,
}

function toFormData(form: HallForm, editing: HallOfFameProfile | null, avatarFile: File | null) {
  const data = new FormData()
  Object.entries(form).forEach(([key, value]) => data.append(key, String(value)))
  data.set('is_public', form.is_public ? 'true' : 'false')
  if (editing) {
    data.append('id', editing.id)
    if (editing.avatar_path) data.append('avatar_path', editing.avatar_path)
  }
  if (avatarFile) data.append('avatar_file', avatarFile)
  return data
}

function formatDate(date?: string | null) {
  if (!date) return 'No induction date'
  const parsed = new Date(`${date}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminHallOfFamePage() {
  const [profiles, setProfiles] = useState<HallOfFameProfile[]>([])
  const [form, setForm] = useState<HallForm>(EMPTY)
  const [editing, setEditing] = useState<HallOfFameProfile | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [fileInputKey, setFileInputKey] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function load() {
    setLoading(true)
    const res = await fetch('/api/hall-of-fame?includeHidden=1')
    if (res.status === 401) {
      router.push('/admin')
      return
    }
    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: 'Could not load profiles.' }))
      setError(data.error || 'Could not load profiles.')
      setProfiles([])
      setLoading(false)
      return
    }
    setProfiles(await res.json())
    setError('')
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function updateField<K extends keyof HallForm>(key: K, value: HallForm[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function resetForm() {
    setForm(EMPTY)
    setEditing(null)
    setAvatarFile(null)
    setFileInputKey(key => key + 1)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.display_name.trim() || !form.short_description.trim()) {
      setError('Display name and short description are required.')
      return
    }

    setSaving(true)
    const res = await fetch('/api/hall-of-fame', {
      method: editing ? 'PUT' : 'POST',
      body: toFormData(form, editing, avatarFile),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: 'Could not save profile.' }))
      setError(data.error || 'Could not save profile.')
      setSaving(false)
      return
    }

    setMsg(editing ? 'Profile updated.' : 'Profile added.')
    setTimeout(() => setMsg(''), 2500)
    resetForm()
    await load()
    setSaving(false)
  }

  function startEdit(profile: HallOfFameProfile) {
    setEditing(profile)
    setForm({
      display_name: profile.display_name,
      role_title: profile.role_title || '',
      short_description: profile.short_description,
      biography: profile.biography || '',
      avatar_url: profile.avatar_url || '',
      inducted_at: profile.inducted_at || '',
      tags: profile.tags?.join(', ') || '',
      status: profile.status || '',
      sort_order: profile.sort_order?.toString() || '',
      is_public: profile.is_public,
    })
    setAvatarFile(null)
    setFileInputKey(key => key + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function remove(profile: HallOfFameProfile) {
    if (!confirm(`Delete ${profile.display_name} from the Hall of Fame?`)) return
    const res = await fetch('/api/hall-of-fame', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: profile.id, avatar_path: profile.avatar_path }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: 'Could not delete profile.' }))
      setError(data.error || 'Could not delete profile.')
      return
    }
    setMsg('Profile deleted.')
    setTimeout(() => setMsg(''), 2500)
    load()
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-[#dce6f4] mb-1">{editing ? 'Edit Hall of Fame Profile' : 'Add Hall of Fame Profile'}</h1>
        <p className="text-[#4a5c72] text-sm">Public honors page. Hidden profiles stay out of the public Hall of Fame.</p>
      </div>

      {msg && <div className="mb-5 px-4 py-3 bg-green-950/30 border border-green-800 text-green-400 text-sm rounded-sm">{msg}</div>}
      {error && <div className="mb-5 px-4 py-3 bg-red-950/30 border border-red-900 text-red-300 text-sm rounded-sm">{error}</div>}

      <form onSubmit={save} className="bg-[#07111e] border border-[rgba(255,255,255,0.06)] rounded-sm p-6 mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="display_name" className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">Display Name *</label>
          <input id="display_name" type="text" value={form.display_name} required placeholder="Player or callsign"
            onChange={e => updateField('display_name', e.target.value)}
            className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840]" />
        </div>

        <div>
          <label htmlFor="role_title" className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">Role / Title</label>
          <input id="role_title" type="text" value={form.role_title} placeholder="Founder, Strategist, Champion..."
            onChange={e => updateField('role_title', e.target.value)}
            className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840]" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="short_description" className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">Short Achievement Text *</label>
          <textarea id="short_description" value={form.short_description} required rows={3} placeholder="Short public achievement summary"
            onChange={e => updateField('short_description', e.target.value)}
            className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840] resize-none" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="biography" className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">Longer Biography</label>
          <textarea id="biography" value={form.biography} rows={5} placeholder="Optional expanded biography"
            onChange={e => updateField('biography', e.target.value)}
            className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840] resize-none" />
        </div>

        <div>
          <label htmlFor="avatar_url" className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">Avatar Image URL</label>
          <input id="avatar_url" type="url" value={form.avatar_url} placeholder="https://..."
            onChange={e => updateField('avatar_url', e.target.value)}
            className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840]" />
        </div>

        <div>
          <label htmlFor="avatar_file" className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">Upload Avatar</label>
          <input key={fileInputKey} id="avatar_file" type="file" accept="image/*"
            onChange={e => setAvatarFile(e.target.files?.[0] || null)}
            className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2 text-[#8090a8] text-sm file:mr-3 file:px-3 file:py-1.5 file:bg-[#c8a840] file:text-[#04090f] file:border-0 file:rounded-sm file:text-xs file:font-semibold" />
        </div>

        <div>
          <label htmlFor="inducted_at" className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">Date Inducted</label>
          <input id="inducted_at" type="date" value={form.inducted_at}
            onChange={e => updateField('inducted_at', e.target.value)}
            className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840]" />
        </div>

        <div>
          <label htmlFor="status" className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">Status</label>
          <select id="status" value={form.status} onChange={e => updateField('status', e.target.value)}
            className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840]">
            <option value="">No status</option>
            <option value="Active">Active</option>
            <option value="Retired">Retired</option>
            <option value="Honored">Honored</option>
          </select>
        </div>

        <div>
          <label htmlFor="tags" className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">Tags / Badges</label>
          <input id="tags" type="text" value={form.tags} placeholder="Founder, Veteran, MVP"
            onChange={e => updateField('tags', e.target.value)}
            className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840]" />
          <p className="text-[#2a3a50] text-[0.6rem] mt-1">Separate tags with commas.</p>
        </div>

        <div>
          <label htmlFor="sort_order" className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">Sort Order</label>
          <input id="sort_order" type="number" value={form.sort_order} placeholder="1"
            onChange={e => updateField('sort_order', e.target.value)}
            className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840]" />
        </div>

        <label className="sm:col-span-2 flex items-center gap-3 text-[#8090a8] text-sm cursor-pointer">
          <input type="checkbox" checked={form.is_public} onChange={e => updateField('is_public', e.target.checked)} className="accent-[#c8a840]" />
          Visible publicly
        </label>

        <div className="sm:col-span-2 flex gap-3 flex-wrap">
          <button type="submit" disabled={saving}
            className="px-8 py-2.5 bg-[#c8a840] text-[#04090f] text-sm font-semibold tracking-widest uppercase rounded-sm hover:bg-[#e0be58] disabled:opacity-50 transition-all">
            {saving ? 'Saving...' : editing ? 'Update Profile' : 'Add Profile'}
          </button>
          {editing && (
            <button type="button" onClick={resetForm}
              className="px-6 py-2.5 border border-[rgba(255,255,255,0.08)] text-[#8090a8] text-sm rounded-sm hover:text-[#dce6f4] bg-transparent cursor-pointer">
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="font-display text-xl text-[#dce6f4] mb-4">All Hall of Fame Profiles</h2>
      {loading ? <p className="text-[#4a5c72] text-sm">Loading...</p> : (
        <div className="flex flex-col gap-px bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] rounded-sm overflow-hidden">
          {profiles.length === 0 ? (
            <div className="p-8 text-center text-[#4a5c72] text-sm">No Hall of Fame profiles yet.</div>
          ) : profiles.map(profile => (
            <div key={profile.id} className="flex items-center gap-4 px-5 py-4 bg-[#07111e] hover:bg-[#0a1828] transition-colors">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={`${profile.display_name} avatar`} className="w-12 h-12 rounded-sm object-cover border border-[rgba(255,255,255,0.08)]" />
              ) : (
                <div className="w-12 h-12 rounded-sm bg-[#04090f] border border-[#7a6420] text-[#c8a840] flex items-center justify-center font-display text-xl">★</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-[#dce6f4] text-sm font-medium">{profile.display_name}</div>
                <div className="text-[#4a5c72] text-xs mt-0.5 truncate">
                  {profile.role_title || 'No role'} · {formatDate(profile.inducted_at)} · {profile.is_public ? 'Public' : 'Hidden'}
                </div>
              </div>
              <button onClick={() => startEdit(profile)} className="text-[#c8a840] text-xs hover:underline bg-transparent border-none cursor-pointer flex-shrink-0">Edit</button>
              <button onClick={() => remove(profile)} className="text-red-500 text-xs hover:underline bg-transparent border-none cursor-pointer flex-shrink-0">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
