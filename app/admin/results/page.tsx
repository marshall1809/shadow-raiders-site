'use client'
import { useEffect, useState } from 'react'
import type { Result, Competition, MatchOutcome } from '@/lib/types'
import { COMPETITION_LABELS } from '@/lib/types'

const EMPTY = { date: '', competition: 'rise' as Competition, title: '', opponent: '', our_score: '', their_score: '', outcome: '' as MatchOutcome | '', notes: '' }

export default function AdminResultsPage() {
  const [items, setItems] = useState<Result[]>([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  async function load() {
    const res = await fetch('/api/results')
    const data = await res.json()
    setItems(data)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function save() {
    setSaving(true)
    const payload = {
      ...form,
      our_score: form.our_score !== '' ? Number(form.our_score) : null,
      their_score: form.their_score !== '' ? Number(form.their_score) : null,
      ...(editing ? { id: editing } : {}),
    }
    await fetch('/api/results', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setForm(EMPTY); setEditing(null)
    setMsg(editing ? 'Updated.' : 'Result added.')
    setTimeout(() => setMsg(''), 2000)
    load(); setSaving(false)
  }

  async function remove(id: string) {
    if (!confirm('Delete this result?')) return
    await fetch('/api/results', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  function startEdit(r: Result) {
    setEditing(r.id)
    setForm({ date: r.date, competition: r.competition as Competition, title: r.title, opponent: r.opponent, our_score: r.our_score?.toString() ?? '', their_score: r.their_score?.toString() ?? '', outcome: r.outcome || '', notes: r.notes || '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-[#dce6f4] mb-1">{editing ? 'Edit Result' : 'Add Result'}</h1>
      <p className="text-[#4a5c72] text-sm mb-8">Match Results</p>
      {msg && <div className="mb-4 px-4 py-2 bg-green-950/30 border border-green-800 text-green-400 text-sm rounded-sm">{msg}</div>}

      <div className="bg-[#07111e] border border-[rgba(255,255,255,0.06)] rounded-sm p-6 mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'Date', key: 'date', type: 'date' },
          { label: 'Opponent', key: 'opponent', type: 'text', placeholder: 'e.g. Bware' },
          { label: 'Title', key: 'title', type: 'text', placeholder: 'e.g. Rise League — Game 4' },
          { label: 'Our Score', key: 'our_score', type: 'number', placeholder: '0' },
          { label: 'Their Score', key: 'their_score', type: 'number', placeholder: '0' },
        ].map(f => (
          <div key={f.key}>
            <label className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">{f.label}</label>
            <input type={f.type} value={(form as any)[f.key]} placeholder={f.placeholder}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840]" />
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
          <label className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">Outcome</label>
          <select value={form.outcome} onChange={e => setForm(p => ({ ...p, outcome: e.target.value as MatchOutcome | '' }))}
            className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840]">
            <option value="">Select outcome</option>
            <option value="win">Win</option>
            <option value="loss">Loss</option>
            <option value="draw">Draw</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">Notes (optional)</label>
          <input type="text" value={form.notes} placeholder="Brief match notes"
            onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
            className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840]" />
        </div>

        <div className="sm:col-span-2 flex gap-3">
          <button onClick={save} disabled={saving}
            className="px-8 py-2.5 bg-[#c8a840] text-[#04090f] text-sm font-semibold tracking-widest uppercase rounded-sm hover:bg-[#e0be58] disabled:opacity-50 transition-all">
            {saving ? 'Saving...' : editing ? 'Update' : 'Add Result'}
          </button>
          {editing && (
            <button onClick={() => { setEditing(null); setForm(EMPTY) }}
              className="px-6 py-2.5 border border-[rgba(255,255,255,0.08)] text-[#8090a8] text-sm rounded-sm hover:text-[#dce6f4] bg-transparent cursor-pointer">
              Cancel
            </button>
          )}
        </div>
      </div>

      <h2 className="font-display text-xl text-[#dce6f4] mb-4">All Results</h2>
      {loading ? <p className="text-[#4a5c72] text-sm">Loading...</p> : (
        <div className="flex flex-col gap-px bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] rounded-sm overflow-hidden">
          {items.length === 0 ? (
            <div className="p-8 text-center text-[#4a5c72] text-sm">No results yet.</div>
          ) : items.map(r => (
            <div key={r.id} className="flex items-center gap-4 px-5 py-4 bg-[#07111e] hover:bg-[#0a1828] transition-colors">
              <div className="flex-1">
                <div className="text-[#dce6f4] text-sm font-medium">{r.date} — {r.title} vs {r.opponent}</div>
                <div className="text-[#4a5c72] text-xs mt-0.5">{COMPETITION_LABELS[r.competition as Competition]} · {r.our_score ?? '?'} – {r.their_score ?? '?'} · {r.outcome || 'no outcome'}</div>
              </div>
              <button onClick={() => startEdit(r)} className="text-[#c8a840] text-xs hover:underline bg-transparent border-none cursor-pointer">Edit</button>
              <button onClick={() => remove(r.id)} className="text-red-500 text-xs hover:underline bg-transparent border-none cursor-pointer">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
