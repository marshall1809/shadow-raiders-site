'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { COMPETITION_LABELS, COMPETITION_COLORS } from '@/lib/types'
import type { ScheduleItem, Competition } from '@/lib/types'

const FALLBACK: ScheduleItem[] = [
  { id:'1', date:'2025-05-09', time_gmt:'16:00', competition:'rise',     title:'Rise League — Game 4', opponent:'Bware', status:'upcoming', created_at:'', updated_at:'' },
  { id:'2', date:'2025-05-17', time_gmt:'16:00', competition:'friendly', title:'Friendly AvA',         opponent:'TCR',   status:'upcoming', created_at:'', updated_at:'' },
  { id:'3', date:'2025-06-14', time_gmt:'15:00', competition:'rise',     title:'Rise League — Game 4', opponent:'WWS',   status:'upcoming', created_at:'', updated_at:'' },
]

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return {
    day: d.getDate(),
    month: d.toLocaleString('en-GB', { month: 'short' }),
  }
}

export default function SchedulePage() {
  const [items, setItems] = useState<ScheduleItem[]>(FALLBACK)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('schedule')
      .select('*')
      .eq('status', 'upcoming')
      .order('date')
      .then(({ data }) => {
        if (data && data.length > 0) setItems(data)
        setLoading(false)
      })
  }, [])

  const LEGEND = [
    { key: 'rise',     label: 'Rise League' },
    { key: 'cfc',      label: 'CFC' },
    { key: 'ams',      label: 'Alliance Masters Series' },
    { key: 'friendly', label: 'Friendly / AvA' },
  ] as const

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-20">
      <div className="mb-14">
        <p className="font-mono-sr text-[0.62rem] tracking-[0.3em] uppercase text-[#7a6420] mb-2">SR Team Schedule</p>
        <h2 className="font-display text-[clamp(2.8rem,6vw,5rem)] text-[#dce6f4] mb-4">
          Upcoming <span className="text-[#e0be58]">Events</span>
        </h2>
        <p className="text-[#8090a8] text-base font-light leading-relaxed max-w-[540px]">
          All scheduled matches and events. Times shown in GMT. Join Discord for game-day updates and coordination.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6">
        {LEGEND.map(l => (
          <div key={l.key} className="flex items-center gap-2 font-mono-sr text-[0.62rem] tracking-[0.14em] uppercase text-[#4a5c72]">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: COMPETITION_COLORS[l.key as Competition].border }} />
            {l.label}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-[#4a5c72] font-mono-sr text-sm tracking-widest text-center py-20">Loading schedule...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-[#4a5c72]">
          <p className="font-display text-2xl mb-2">No upcoming events</p>
          <p className="text-sm font-light">Check back soon or join Discord for announcements.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-px bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] rounded-sm overflow-hidden mb-6">
          {items.map(item => {
            const { day, month } = formatDate(item.date)
            const colors = COMPETITION_COLORS[item.competition as Competition]
            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-6 py-5 bg-[#0a1828] hover:bg-[#0e2035] transition-colors border-l-[3px]"
                style={{ borderLeftColor: colors.border }}
              >
                {/* Date */}
                <div className="text-center px-3 py-2 border border-[rgba(255,255,255,0.06)] rounded-sm bg-[rgba(0,0,0,0.2)] min-w-[56px]">
                  <div className="font-display text-[1.8rem] leading-none text-[#dce6f4]">{day}</div>
                  <div className="font-mono-sr text-[0.58rem] tracking-[0.18em] uppercase text-[#4a5c72] mt-0.5">{month}</div>
                </div>

                {/* Badge */}
                <span className={`font-mono-sr text-[0.58rem] tracking-[0.14em] uppercase px-2.5 py-1 rounded-sm border ${colors.badge} whitespace-nowrap`}>
                  {COMPETITION_LABELS[item.competition as Competition]}
                </span>

                {/* Info */}
                <div className="flex-1">
                  <div className="text-[#dce6f4] text-sm font-semibold mb-0.5">{item.title}</div>
                  <div className="text-[#8090a8] text-sm font-light">vs <span className="text-[#dce6f4] font-semibold">{item.opponent}</span></div>
                  {item.notes && <div className="text-[#4a5c72] text-xs mt-1 font-light">{item.notes}</div>}
                </div>

                {/* Time */}
                <div className="text-right">
                  <div className="font-display text-[1.5rem] leading-none text-[#e0be58] tracking-wide">{item.time_gmt}</div>
                  <div className="font-mono-sr text-[0.55rem] tracking-[0.2em] uppercase text-[#4a5c72] mt-0.5">GMT</div>
                </div>

                {/* Status */}
                <span className="font-mono-sr text-[0.58rem] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full border border-[rgba(200,168,64,0.3)] text-[#c8a840] whitespace-nowrap">
                  Upcoming
                </span>
              </div>
            )
          })}
        </div>
      )}

      <div className="p-5 bg-[#0a1828] border border-[rgba(255,255,255,0.06)] border-l-2 border-l-[#c8a840] rounded-r-sm text-[#8090a8] text-sm font-light leading-relaxed">
        All times are in <strong className="text-[#dce6f4] font-medium">GMT</strong>. Most AvA wars run between 15:00–19:00 GMT.
        For the latest updates and game-day coordination, join our{' '}
        <a href="https://discord.gg/cmuGSVXQFN" target="_blank" rel="noopener noreferrer"
          className="text-[#c8a840] border-b border-[#7a6420] hover:border-[#c8a840] transition-colors">
          Discord server
        </a>.
      </div>
    </div>
  )
}
