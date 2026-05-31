'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push('/admin/schedule')
    } else {
      setError('Incorrect password.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#04090f] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="font-display text-[#c8a840] text-3xl mb-1">Shadow Raiders</div>
          <div className="font-mono-sr text-[#4a5c72] text-xs tracking-widest">Admin Panel</div>
        </div>
        <form onSubmit={handleSubmit} className="bg-[#07111e] border border-[rgba(255,255,255,0.06)] rounded-sm p-8 flex flex-col gap-4">
          <label className="font-mono-sr text-[0.62rem] tracking-[0.22em] uppercase text-[#4a5c72]">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-4 py-3 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840] transition-colors"
            placeholder="Enter admin password"
            required
          />
          {error && <p className="text-red-400 text-xs font-mono-sr">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 py-3 bg-[#c8a840] text-[#04090f] text-sm font-semibold tracking-widest uppercase rounded-sm transition-all hover:bg-[#e0be58] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center mt-6 text-[#4a5c72] text-xs font-mono-sr">
          <a href="/" className="hover:text-[#c8a840] transition-colors">← Back to site</a>
        </p>
      </div>
    </div>
  )
}
