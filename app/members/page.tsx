'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MembersLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/members-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (res.ok) {
      router.push('/members/home')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'Invalid credentials.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#04090f] flex flex-col items-center justify-center px-6">
      {/* Background grid */}
      <div className="hero-grid absolute inset-0 opacity-40" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo / header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-full border border-[#7a6420] bg-[rgba(200,168,64,0.06)] flex items-center justify-center text-[#c8a840] text-2xl mx-auto mb-4">
            ⚔
          </div>
          <div className="font-display text-[#c8a840] text-3xl mb-1">Members Area</div>
          <div className="font-mono-sr text-[#4a5c72] text-xs tracking-widest">Shadow Raiders Alliance</div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#07111e] border border-[rgba(255,255,255,0.06)] rounded-sm p-8 flex flex-col gap-5">
          <div>
            <label className="font-mono-sr text-[0.6rem] tracking-[0.22em] uppercase text-[#4a5c72] block mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              placeholder="Your in-game name"
              required
              className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-4 py-3 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840] transition-colors placeholder:text-[#2a3a50]"
            />
          </div>
          <div>
            <label className="font-mono-sr text-[0.6rem] tracking-[0.22em] uppercase text-[#4a5c72] block mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Your personal password"
              required
              className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-4 py-3 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840] transition-colors placeholder:text-[#2a3a50]"
            />
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-950/30 border border-red-900 rounded-sm text-red-400 text-xs font-mono-sr">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 py-3.5 bg-[#c8a840] text-[#04090f] text-sm font-semibold tracking-widest uppercase rounded-sm transition-all hover:bg-[#e0be58] hover:shadow-[0_4px_24px_rgba(200,168,64,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Enter Members Area'}
          </button>
        </form>

        <p className="text-center mt-6 text-[#2a3a50] text-xs font-mono-sr leading-relaxed">
          Access is restricted to Shadow Raiders members.<br />
          Contact <span className="text-[#c8a840]">Marc1809</span> on Discord if you need your credentials.
        </p>

        <p className="text-center mt-4">
          <a href="/" className="text-[#4a5c72] text-xs hover:text-[#8090a8] transition-colors">
            ← Back to site
          </a>
        </p>
      </div>
    </div>
  )
}
