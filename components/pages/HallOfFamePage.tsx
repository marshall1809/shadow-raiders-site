'use client'
import { useEffect, useState } from 'react'
import type { HallOfFameProfile } from '@/lib/types'

function formatDate(date?: string | null) {
  if (!date) return 'Date not set'
  const parsed = new Date(`${date}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('') || 'SR'
}

function statusClass(status?: string | null) {
  const normalized = status?.toLowerCase()
  if (normalized === 'active') return 'border-green-800 text-green-400 bg-green-950/20'
  if (normalized === 'retired') return 'border-[#4a5c72] text-[#8090a8] bg-[#07111e]'
  if (normalized === 'honored') return 'border-[#7a6420] text-[#c8a840] bg-[rgba(200,168,64,0.08)]'
  return 'border-[#2e4f6a] text-[#7ca0c2] bg-[rgba(90,130,168,0.08)]'
}

function HallOfFameCard({ profile }: { profile: HallOfFameProfile }) {
  const [expanded, setExpanded] = useState(false)
  const tags = profile.tags?.filter(Boolean) || []
  const hasBio = Boolean(profile.biography?.trim())

  return (
    <article className="group bg-[#0a1828] border border-[rgba(255,255,255,0.06)] rounded-sm overflow-hidden transition-colors hover:bg-[#0e2035] relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,#c8a840,transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="p-7 flex flex-col h-full">
        <div className="flex items-start gap-5 mb-5">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={`${profile.display_name} avatar`}
              className="w-20 h-20 rounded-sm object-cover border border-[rgba(200,168,64,0.24)] bg-[#04090f] flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-sm border border-[#7a6420] bg-[rgba(200,168,64,0.06)] text-[#c8a840] flex items-center justify-center font-display text-3xl flex-shrink-0">
              {initials(profile.display_name)}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="font-display text-3xl leading-none text-[#e0be58] mb-1 break-words">{profile.display_name}</h3>
            {profile.role_title && (
              <p className="font-mono-sr text-[0.6rem] tracking-[0.18em] uppercase text-[#7ca0c2] leading-snug">{profile.role_title}</p>
            )}
          </div>
        </div>

        <p className="text-[#dce6f4] text-sm font-semibold leading-relaxed mb-4">{profile.short_description}</p>

        <div className="flex flex-wrap gap-2 mb-5">
          {profile.status && (
            <span className={`font-mono-sr text-[0.56rem] tracking-[0.16em] uppercase px-2.5 py-1 rounded-sm border ${statusClass(profile.status)}`}>
              {profile.status}
            </span>
          )}
          {tags.map(tag => (
            <span key={tag} className="font-mono-sr text-[0.56rem] tracking-[0.16em] uppercase px-2.5 py-1 rounded-sm border border-[#7a6420] text-[#c8a840] bg-[rgba(200,168,64,0.05)]">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between gap-4">
          <div>
            <div className="font-mono-sr text-[0.55rem] tracking-[0.18em] uppercase text-[#4a5c72] mb-0.5">Inducted</div>
            <div className="text-[#8090a8] text-xs font-light">{formatDate(profile.inducted_at)}</div>
          </div>
          {hasBio && (
            <button
              type="button"
              onClick={() => setExpanded(open => !open)}
              className="text-[#c8a840] text-xs font-semibold tracking-widest uppercase bg-transparent border border-[#7a6420] rounded-sm px-3 py-2 hover:bg-[#c8a840] hover:text-[#04090f] transition-all cursor-pointer"
              aria-expanded={expanded}
            >
              {expanded ? 'Close' : 'Read Bio'}
            </button>
          )}
        </div>

        {hasBio && expanded && (
          <div className="mt-5 pt-5 border-t border-[rgba(255,255,255,0.06)] text-[#8090a8] text-sm font-light leading-relaxed whitespace-pre-wrap">
            {profile.biography}
          </div>
        )}
      </div>
    </article>
  )
}

export default function HallOfFamePage() {
  const [profiles, setProfiles] = useState<HallOfFameProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/hall-of-fame')
      .then(async res => {
        if (!res.ok) return []
        return await res.json() as HallOfFameProfile[]
      })
      .then(data => setProfiles(data))
      .catch(() => setProfiles([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="max-w-[1100px] mx-auto px-6 py-20">
      <header className="mb-14">
        <p className="font-mono-sr text-[0.62rem] tracking-[0.3em] uppercase text-[#7a6420] mb-2">Shadow Raiders Honors</p>
        <h1 className="font-display text-[clamp(2.8rem,6vw,5rem)] text-[#dce6f4] mb-4">
          Hall of <span className="text-[#e0be58]">Fame</span>
        </h1>
        <p className="text-[#8090a8] text-base font-light leading-relaxed max-w-[620px]">
          A record of members whose discipline, loyalty, leadership, or competitive impact helped define Shadow Raiders.
        </p>
      </header>

      {loading ? (
        <div className="text-[#4a5c72] font-mono-sr text-sm tracking-widest text-center py-20">Loading Hall of Fame...</div>
      ) : profiles.length === 0 ? (
        <section className="text-center py-24 border border-[rgba(255,255,255,0.06)] rounded-sm bg-[#07111e]">
          <div className="font-display text-5xl text-[#4a5c72] mb-4">★</div>
          <p className="font-display text-2xl text-[#dce6f4] mb-2">No Hall of Fame profiles have been added yet.</p>
          <p className="text-[#4a5c72] text-sm font-light">Profiles added by admins will appear here.</p>
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" aria-label="Hall of Fame profiles">
          {profiles.map(profile => <HallOfFameCard key={profile.id} profile={profile} />)}
        </section>
      )}
    </main>
  )
}
