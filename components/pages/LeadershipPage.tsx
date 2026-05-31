'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Leader } from '@/lib/types'

const FALLBACK: Leader[] = [
  { id:'1', rank_order:1, name:'Marc1809',  rank_title:'Command — Rank 1', role_title:'Founder & Alliance Owner',
    bio:'Founded both Shadow Raiders and its predecessor Raiders CoN. Has led the organisation as Alliance Owner and Leader from day one — the constant at the centre of everything Shadow Raiders has built.',
    badge_text:'✦ Founder · Since 2023', created_at:'', updated_at:'' },
  { id:'2', rank_order:2, name:'King Andy', rank_title:'Command — Rank 2', role_title:'2nd in Command',
    bio:'The longest-serving member of the alliance, having joined in summer 2023. King Andy has been a pillar of the organisation since its earliest days, accumulating years of leadership experience alongside the founder.',
    badge_text:'★ Since Summer 2023', created_at:'', updated_at:'' },
  { id:'3', rank_order:3, name:'Anton',     rank_title:'Command — Rank 3', role_title:'3rd in Command',
    bio:'A core member for over two years, Anton has built deep operational experience and plays a key role in the day-to-day running of the alliance and its competitive campaigns.',
    badge_text:'◉ 2+ Years Experience', created_at:'', updated_at:'' },
  { id:'4', rank_order:4, name:'Lost Soul', rank_title:'Command — Rank 4', role_title:'4th in Command',
    bio:'Over a year of internal command experience, Lost Soul has proven themselves as a reliable and effective leader. Their operational knowledge and commitment to the team continue to strengthen the command structure.',
    badge_text:'◈ 1+ Year Internal Experience', created_at:'', updated_at:'' },
]

interface LeadershipPageProps { onNavigate: (p: string) => void }

export default function LeadershipPage({ onNavigate }: LeadershipPageProps) {
  const [leaders, setLeaders] = useState<Leader[]>(FALLBACK)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('leadership')
      .select('*')
      .order('rank_order')
      .then(({ data }) => {
        if (data && data.length > 0) setLeaders(data)
        setLoading(false)
      })
  }, [])

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-20">
      <div className="mb-14">
        <p className="font-mono-sr text-[0.62rem] tracking-[0.3em] uppercase text-[#7a6420] mb-2">Command Structure</p>
        <h2 className="font-display text-[clamp(2.8rem,6vw,5rem)] text-[#dce6f4] mb-4">
          The <span className="text-[#e0be58]">Leadership</span>
        </h2>
        <p className="text-[#8090a8] text-base font-light leading-relaxed max-w-[580px]">
          The same ownership and core command team since 2023. Years of shared experience means high standards,
          consistent decisions, and a stable environment for every member.
        </p>
      </div>

      {loading ? (
        <div className="text-[#4a5c72] text-sm font-mono-sr tracking-widest text-center py-20">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] rounded-sm overflow-hidden mb-10">
          {leaders.map(leader => (
            <div key={leader.id} className="group p-9 bg-[#0a1828] hover:bg-[#0e2035] transition-colors relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,#c8a840,transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="font-mono-sr text-[0.58rem] tracking-[0.22em] uppercase text-[#7a6420] mb-2">{leader.rank_title}</div>
              <div className="font-display text-[1.9rem] text-[#e0be58] mb-1">{leader.name}</div>
              <div className="text-[#8090a8] text-[0.78rem] font-semibold tracking-widest uppercase mb-4">{leader.role_title}</div>
              <p className="text-[#8090a8] text-sm font-light leading-relaxed mb-4">{leader.bio}</p>
              {leader.badge_text && (
                <span className="inline-flex items-center gap-2 px-3 py-1 border border-[#7a6420] text-[#c8a840] font-mono-sr text-[0.55rem] tracking-[0.16em] uppercase rounded-sm">
                  {leader.badge_text}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="text-center p-14 bg-[rgba(14,32,53,0.5)] border border-[rgba(200,168,64,0.15)] rounded-sm">
        <h3 className="font-display text-3xl text-[#dce6f4] mb-2">Want to Join This Team?</h3>
        <p className="text-[#8090a8] text-sm font-light mb-8">Start in the Academy, prove yourself, and earn your place.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="https://discord.gg/cmuGSVXQFN" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-10 py-3.5 bg-[#c8a840] text-[#04090f] text-sm font-semibold tracking-widest uppercase rounded-sm border border-[#e0be58] transition-all hover:bg-[#e0be58] hover:-translate-y-px">
            Join Shadow Raiders
          </a>
          <button onClick={() => onNavigate('academy')}
            className="inline-flex items-center gap-2 px-8 py-3 text-[#8090a8] text-sm font-medium tracking-widest uppercase rounded-sm border border-[#4a5c72] transition-all hover:border-[#7a6420] hover:text-[#c8a840] hover:-translate-y-px bg-transparent cursor-pointer">
            Explore the Academy
          </button>
        </div>
        <p className="text-[#4a5c72] text-xs mt-4">Questions? DM <span className="text-[#c8a840] font-medium">Marc1809</span> on Discord.</p>
      </div>
    </div>
  )
}
