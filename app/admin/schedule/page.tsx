'use client'
import { useEffect, useState } from 'react'
import { createServiceClient } from '@/lib/supabase'
import type { ScheduleItem, Competition } from '@/lib/types'
import { COMPETITION_LABELS } from '@/lib/types'

const EMPTY = { date: '', time_gmt: '', competition: 'rise' as Competition, title: '', opponent: '', status: 'upcoming', notes: '' }

export default function AdminSchedulePage() {
  const [items, setItems] = useState<ScheduleItem[]>([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  async function load() {
    const res = await fetch('/api/schedule')
    const data = await res.json()
    setItems(data)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function save() {
    setSaving(true)
    const method = editing ? 'PUT' : 'POST'
    const body = editing ? { ...form, id: editing } : form
    await fetch('/api/schedule', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    setForm(EMPTY)
    setEditing(null)
    setMsg(editing ? 'Updated.' : 'Added.')
    setTimeout(() => setMsg(''), 2000)
    load()
    setSaving(false)
  }

  async function remove(id: string) {
    if (!confirm('Delete this entry?')) return
    await fetch('/api/schedule', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  function startEdit(item: ScheduleItem) {
    setEditing(item.id)
    setForm({ date: item.date, time_gmt: item.time_gmt, competition: item.competition as Competition, title: item.title, opponent: item.opponent, status: item.status, notes: item.notes || '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-[#dce6f4] mb-1">{editing ? 'Edit Event' : 'Add Event'}</h1>
      <p className="text-[#4a5c72] text-sm mb-8">Schedule</p>

      {msg && <div className="mb-4 px-4 py-2 bg-green-950/30 border border-green-800 text-green-400 text-sm rounded-sm">{msg}</div>}

      {/* Form */}
      <div className="bg-[#07111e] border border-[rgba(255,255,255,0.06)] rounded-sm p-6 mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'Date', key: 'date', type: 'date' },
          { label: 'Time (GMT)', key: 'time_gmt', type: 'text', placeholder: '16:00' },
          { label: 'Opponent', key: 'opponent', type: 'text', placeholder: 'e.g. Bware' },
          { label: 'Title', key: 'title', type: 'text', placeholder: 'e.g. Rise League — Game 4' },
        ].map(f => (
          <div key={f.key}>
            <label className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">{f.label}</label>
            <input type={f.type} value={(form as any)[f.key]} placeholder={f.placeholder}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840] transition-colors" />
          </div>
        ))}

        <div>
          <label className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">Competition</label>
          <select value={form.competition} onChange={e => setForm(p => ({ ...p, competition: e.target.value as Competition }))}
            className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840]">
            {Object.entries(COMPETITION_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>

        <div>
          <label className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">Status</label>
          <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
            className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840]">
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">Notes (optional)</label>
          <input type="text" value={form.notes} placeholder="Any additional info"
            onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
            className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840]" />
        </div>

        <div className="sm:col-span-2 flex gap-3">
          <button onClick={save} disabled={saving}
            className="px-8 py-2.5 bg-[#c8a840] text-[#04090f] text-sm font-semibold tracking-widest uppercase rounded-sm hover:bg-[#e0be58] disabled:opacity-50 transition-all">
            {saving ? 'Saving...' : editing ? 'Update' : 'Add Event'}
          </button>
          {editing && (
            <button onClick={() => { setEditing(null); setForm(EMPTY) }}
              className="px-6 py-2.5 border border-[rgba(255,255,255,0.08)] text-[#8090a8] text-sm rounded-sm hover:text-[#dce6f4] transition-colors bg-transparent cursor-pointer">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <h2 className="font-display text-xl text-[#dce6f4] mb-4">All Events</h2>
      {loading ? <p className="text-[#4a5c72] text-sm">Loading...</p> : (
        <div className="flex flex-col gap-px bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] rounded-sm overflow-hidden">
          {items.length === 0 ? (
            <div className="p-8 text-center text-[#4a5c72] text-sm">No events yet.</div>
          ) : items.map(item => (
            <div key={item.id} className="flex items-center gap-4 px-5 py-4 bg-[#07111e] hover:bg-[#0a1828] transition-colors">
              <div className="flex-1">
                <div className="text-[#dce6f4] text-sm font-medium">{item.date} — {item.title}</div>
                <div className="text-[#4a5c72] text-xs mt-0.5">vs {item.opponent} · {COMPETITION_LABELS[item.competition as Competition]} · {item.time_gmt} GMT · {item.status}</div>
              </div>
              <button onClick={() => startEdit(item)} className="text-[#c8a840] text-xs hover:underline bg-transparent border-none cursor-pointer">Edit</button>
              <button onClick={() => remove(item.id)} className="text-red-500 text-xs hover:underline bg-transparent border-none cursor-pointer">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
