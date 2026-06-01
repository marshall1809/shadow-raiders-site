'use client'
import { useEffect, useState } from 'react'
import type { Member, MemberRole } from '@/lib/types'

function generatePassword(length = 12): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

const EMPTY = { username: '', password: '', role: 'member' as MemberRole, notes: '' }

export default function AdminMembersPage() {
  const [members, setMembers]   = useState<Member[]>([])
  const [form, setForm]         = useState(EMPTY)
  const [editing, setEditing]   = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [msg, setMsg]           = useState('')
  const [filter, setFilter]     = useState<'all' | 'active' | 'inactive'>('active')

  async function load() {
    const res = await fetch('/api/members')
    const data = await res.json()
    setMembers(data)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function save() {
    setSaving(true)
    await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setForm(EMPTY)
    setMsg(`Member "${form.username}" created.`)
    setTimeout(() => setMsg(''), 3000)
    load()
    setSaving(false)
  }

  async function update(member: Member, changes: Partial<Member> & { newPassword?: string }) {
    await fetch('/api/members', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: member.id, role: member.role, notes: member.notes, active: member.active, ...changes }),
    })
    load()
  }

  async function toggleActive(member: Member) {
    const action = member.active ? 'deactivate' : 'reactivate'
    if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} ${member.username}? ${member.active ? 'Their session will be revoked immediately.' : ''}`)) return
    await update(member, { active: !member.active })
    setMsg(`${member.username} ${member.active ? 'deactivated' : 'reactivated'}.`)
    setTimeout(() => setMsg(''), 2000)
  }

  async function resetPassword(member: Member) {
    const pw = newPassword || generatePassword()
    if (!confirm(`Reset password for ${member.username} to: "${pw}"?\n\nMake sure to copy this — it won't be shown again.`)) return
    await update(member, { newPassword: pw })
    setMsg(`Password reset for ${member.username}. New password: ${pw}`)
    setNewPassword('')
  }

  async function deletePermanently(member: Member) {
    if (!confirm(`Permanently delete ${member.username}? This cannot be undone.`)) return
    await fetch('/api/members', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: member.id }),
    })
    load()
  }

  const displayed = members.filter(m =>
    filter === 'all' ? true : filter === 'active' ? m.active : !m.active
  )
  const activeCount = members.filter(m => m.active).length

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl text-[#dce6f4] mb-1">Member Accounts</h1>
      <p className="text-[#4a5c72] text-sm mb-8">{activeCount} active member{activeCount !== 1 ? 's' : ''}</p>

      {msg && (
        <div className="mb-5 px-4 py-3 bg-[#0a1828] border border-[#c8a840] text-[#e0be58] text-sm rounded-sm font-mono-sr break-all">
          {msg}
        </div>
      )}

      {/* Create new member */}
      <div className="bg-[#07111e] border border-[rgba(255,255,255,0.06)] rounded-sm p-6 mb-10">
        <div className="font-mono-sr text-[0.62rem] tracking-[0.22em] uppercase text-[#7a6420] mb-4">Create New Member</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">Username</label>
            <input type="text" value={form.username} placeholder="In-game name or alias"
              onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
              className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840]" />
          </div>
          <div>
            <label className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">
              Password
              <button type="button" onClick={() => setForm(p => ({ ...p, password: generatePassword() }))}
                className="ml-2 text-[#c8a840] hover:underline bg-transparent border-none cursor-pointer text-[0.55rem] tracking-[0.15em]">
                Generate
              </button>
            </label>
            <input type="text" value={form.password} placeholder="Set a unique password"
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840] font-mono" />
            <p className="text-[#2a3a50] text-[0.6rem] mt-1">This will be shown only once — copy it before saving.</p>
          </div>
          <div>
            <label className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">Role</label>
            <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as MemberRole }))}
              className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840]">
              <option value="member">Member</option>
              <option value="officer">Officer</option>
            </select>
          </div>
          <div>
            <label className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">Notes (admin only)</label>
            <input type="text" value={form.notes} placeholder="e.g. joined May 2025, academy grad"
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840]" />
          </div>
        </div>
        <button onClick={save} disabled={saving || !form.username || !form.password}
          className="mt-4 px-8 py-2.5 bg-[#c8a840] text-[#04090f] text-sm font-semibold tracking-widest uppercase rounded-sm hover:bg-[#e0be58] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          {saving ? 'Creating...' : 'Create Member'}
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-0 border-b border-[rgba(255,255,255,0.06)] mb-4">
        {(['active', 'inactive', 'all'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-5 py-2.5 text-xs font-medium tracking-widest uppercase border-b-2 transition-all cursor-pointer bg-transparent capitalize ${
              filter === f ? 'text-[#c8a840] border-[#c8a840]' : 'text-[#4a5c72] border-transparent hover:text-[#8090a8]'
            }`}>
            {f} ({f === 'all' ? members.length : f === 'active' ? members.filter(m => m.active).length : members.filter(m => !m.active).length})
          </button>
        ))}
      </div>

      {/* Members list */}
      {loading ? <p className="text-[#4a5c72] text-sm">Loading...</p> : (
        <div className="flex flex-col gap-px bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] rounded-sm overflow-hidden">
          {displayed.length === 0 ? (
            <div className="p-8 text-center text-[#4a5c72] text-sm">No members in this category.</div>
          ) : displayed.map(member => (
            <div key={member.id} className={`p-5 bg-[#07111e] hover:bg-[#0a1828] transition-colors ${!member.active ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[#dce6f4] text-sm font-semibold">{member.username}</span>
                    <span className={`font-mono-sr text-[0.52rem] tracking-widest uppercase px-1.5 py-0.5 rounded border ${
                      member.role === 'officer'
                        ? 'border-[#c8a840] text-[#c8a840]'
                        : 'border-[#2a3a50] text-[#4a5c72]'
                    }`}>{member.role}</span>
                    {!member.active && <span className="font-mono-sr text-[0.52rem] tracking-widest uppercase px-1.5 py-0.5 rounded border border-red-900 text-red-500">Inactive</span>}
                  </div>
                  {member.notes && <div className="text-[#4a5c72] text-xs font-light">{member.notes}</div>}
                  <div className="text-[#2a3a50] text-[0.6rem] font-mono-sr mt-1">
                    Created {new Date(member.created_at).toLocaleDateString('en-GB')}
                    {member.last_login && ` · Last login ${new Date(member.last_login).toLocaleDateString('en-GB')}`}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* Reset password */}
                  <button onClick={() => resetPassword(member)}
                    className="text-[#8090a8] text-xs hover:text-[#c8a840] transition-colors bg-transparent border-none cursor-pointer">
                    Reset PW
                  </button>
                  {/* Toggle active */}
                  <button onClick={() => toggleActive(member)}
                    className={`text-xs transition-colors bg-transparent border-none cursor-pointer ${member.active ? 'text-[#8090a8] hover:text-red-400' : 'text-green-500 hover:text-green-400'}`}>
                    {member.active ? 'Deactivate' : 'Reactivate'}
                  </button>
                  {/* Permanent delete */}
                  <button onClick={() => deletePermanently(member)}
                    className="text-red-700 text-xs hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
