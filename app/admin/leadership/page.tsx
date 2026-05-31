'use client'
import { useEffect, useState } from 'react'
import type { Leader } from '@/lib/types'

const EMPTY = { rank_order: '', name: '', rank_title: '', role_title: '', bio: '', badge_text: '' }

export default function AdminLeadershipPage() {
  const [items, setItems] = useState<Leader[]>([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  async function load() {
    const res = await fetch('/api/leadership')
    const data = await res.json()
    setItems(data)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function save() {
    setSaving(true)
    const payload = { ...form, rank_order: Number(form.rank_order), ...(editing ? { id: editing } : {}) }
    await fetch('/api/leadership', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setForm(EMPTY); setEditing(null)
    setMsg(editing ? 'Updated.' : 'Leader added.')
    setTimeout(() => setMsg(''), 2000)
    load(); setSaving(false)
  }

  async function remove(id: string) {
    if (!confirm('Remove this leader?')) return
    await fetch('/api/leadership', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  function startEdit(l: Leader) {
    setEditing(l.id)
    setForm({ rank_order: l.rank_order.toString(), name: l.name, rank_title: l.rank_title, role_title: l.role_title, bio: l.bio, badge_text: l.badge_text || '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-[#dce6f4] mb-1">{editing ? 'Edit Leader' : 'Add Leader'}</h1>
      <p className="text-[#4a5c72] text-sm mb-8">Leadership</p>
      {msg && <div className="mb-4 px-4 py-2 bg-green-950/30 border border-green-800 text-green-400 text-sm rounded-sm">{msg}</div>}

      <div className="bg-[#07111e] border border-[rgba(255,255,255,0.06)] rounded-sm p-6 mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'Rank Order', key: 'rank_order', type: 'number', placeholder: '1' },
          { label: 'Name', key: 'name', type: 'text', placeholder: 'e.g. Marc1809' },
          { label: 'Rank Title', key: 'rank_title', type: 'text', placeholder: 'e.g. Command — Rank 1' },
          { label: 'Role Title', key: 'role_title', type: 'text', placeholder: 'e.g. Founder & Alliance Owner' },
          { label: 'Badge Text', key: 'badge_text', type: 'text', placeholder: 'e.g. ✦ Founder · Since 2023' },
        ].map(f => (
          <div key={f.key}>
            <label className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">{f.label}</label>
            <input type={f.type} value={(form as any)[f.key]} placeholder={f.placeholder}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840]" />
          </div>
        ))}
        <div className="sm:col-span-2">
          <label className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">Bio</label>
          <textarea value={form.bio} rows={4} placeholder="Leader biography..."
            onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
            className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840] resize-none" />
        </div>
        <div className="sm:col-span-2 flex gap-3">
          <button onClick={save} disabled={saving}
            className="px-8 py-2.5 bg-[#c8a840] text-[#04090f] text-sm font-semibold tracking-widest uppercase rounded-sm hover:bg-[#e0be58] disabled:opacity-50 transition-all">
            {saving ? 'Saving...' : editing ? 'Update' : 'Add Leader'}
          </button>
          {editing && (
            <button onClick={() => { setEditing(null); setForm(EMPTY) }}
              className="px-6 py-2.5 border border-[rgba(255,255,255,0.08)] text-[#8090a8] text-sm rounded-sm hover:text-[#dce6f4] bg-transparent cursor-pointer">
              Cancel
            </button>
          )}
        </div>
      </div>

      <h2 className="font-display text-xl text-[#dce6f4] mb-4">Command Team</h2>
      {loading ? <p className="text-[#4a5c72] text-sm">Loading...</p> : (
        <div className="flex flex-col gap-px bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] rounded-sm overflow-hidden">
          {items.map(l => (
            <div key={l.id} className="flex items-center gap-4 px-5 py-4 bg-[#07111e] hover:bg-[#0a1828] transition-colors">
              <div className="flex-1">
                <div className="text-[#dce6f4] text-sm font-medium">#{l.rank_order} {l.name}</div>
                <div className="text-[#4a5c72] text-xs mt-0.5">{l.role_title}</div>
              </div>
              <button onClick={() => startEdit(l)} className="text-[#c8a840] text-xs hover:underline bg-transparent border-none cursor-pointer">Edit</button>
              <button onClick={() => remove(l.id)} className="text-red-500 text-xs hover:underline bg-transparent border-none cursor-pointer">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
