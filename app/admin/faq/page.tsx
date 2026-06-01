'use client'
import { useEffect, useState } from 'react'
import type { FaqItem } from '@/lib/types'

const EMPTY = { sort_order: '', question: '', answer: '' }

export default function AdminFaqPage() {
  const [items, setItems] = useState<FaqItem[]>([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  async function load() {
    const res = await fetch('/api/faq')
    const data = await res.json()
    setItems(data)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function save() {
    setSaving(true)
    const payload = { ...form, sort_order: Number(form.sort_order), ...(editing ? { id: editing } : {}) }
    await fetch('/api/faq', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setForm(EMPTY); setEditing(null)
    setMsg(editing ? 'Updated.' : 'FAQ entry added.')
    setTimeout(() => setMsg(''), 2000)
    load(); setSaving(false)
  }

  async function remove(id: string) {
    if (!confirm('Delete this FAQ entry?')) return
    await fetch('/api/faq', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  function startEdit(f: FaqItem) {
    setEditing(f.id)
    setForm({ sort_order: f.sort_order.toString(), question: f.question, answer: f.answer })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-[#dce6f4] mb-1">{editing ? 'Edit FAQ Entry' : 'Add FAQ Entry'}</h1>
      <p className="text-[#4a5c72] text-sm mb-8">FAQ</p>
      {msg && <div className="mb-4 px-4 py-2 bg-green-950/30 border border-green-800 text-green-400 text-sm rounded-sm">{msg}</div>}

      <div className="bg-[#07111e] border border-[rgba(255,255,255,0.06)] rounded-sm p-6 mb-10 flex flex-col gap-4">
        <div>
          <label className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">Sort Order</label>
          <input type="number" value={form.sort_order} placeholder="1"
            onChange={e => setForm(p => ({ ...p, sort_order: e.target.value }))}
            className="w-24 bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840]" />
        </div>
        <div>
          <label className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">Question</label>
          <input type="text" value={form.question} placeholder="Enter the question"
            onChange={e => setForm(p => ({ ...p, question: e.target.value }))}
            className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840]" />
        </div>
        <div>
          <label className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">Answer</label>
          <textarea value={form.answer} rows={4} placeholder="Enter the answer"
            onChange={e => setForm(p => ({ ...p, answer: e.target.value }))}
            className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840] resize-none" />
        </div>
        <div className="flex gap-3">
          <button onClick={save} disabled={saving}
            className="px-8 py-2.5 bg-[#c8a840] text-[#04090f] text-sm font-semibold tracking-widest uppercase rounded-sm hover:bg-[#e0be58] disabled:opacity-50 transition-all">
            {saving ? 'Saving...' : editing ? 'Update' : 'Add Entry'}
          </button>
          {editing && (
            <button onClick={() => { setEditing(null); setForm(EMPTY) }}
              className="px-6 py-2.5 border border-[rgba(255,255,255,0.08)] text-[#8090a8] text-sm rounded-sm bg-transparent cursor-pointer">
              Cancel
            </button>
          )}
        </div>
      </div>

      <h2 className="font-display text-xl text-[#dce6f4] mb-4">All Questions</h2>
      {loading ? <p className="text-[#4a5c72] text-sm">Loading...</p> : (
        <div className="flex flex-col gap-px bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] rounded-sm overflow-hidden">
          {items.map(item => (
            <div key={item.id} className="flex items-start gap-4 px-5 py-4 bg-[#07111e] hover:bg-[#0a1828] transition-colors">
              <div className="font-mono-sr text-[#7a6420] text-xs mt-0.5 min-w-[20px]">#{item.sort_order}</div>
              <div className="flex-1">
                <div className="text-[#dce6f4] text-sm font-medium">{item.question}</div>
                <div className="text-[#4a5c72] text-xs mt-0.5 line-clamp-1">{item.answer}</div>
              </div>
              <button onClick={() => startEdit(item)} className="text-[#c8a840] text-xs hover:underline bg-transparent border-none cursor-pointer flex-shrink-0">Edit</button>
              <button onClick={() => remove(item.id)} className="text-red-500 text-xs hover:underline bg-transparent border-none cursor-pointer flex-shrink-0">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
