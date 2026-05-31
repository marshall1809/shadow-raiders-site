'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { COMPETITION_LABELS, COMPETITION_COLORS, OUTCOME_COLORS } from '@/lib/types'
import type { Result, Competition, MatchOutcome } from '@/lib/types'

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('results')
      .select('*')
      .order('date', { ascending: false })
      .then(({ data }) => {
        if (data) setResults(data)
        setLoading(false)
      })
  }, [])

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-20">
      <div className="mb-14">
        <p className="font-mono-sr text-[0.62rem] tracking-[0.3em] uppercase text-[#7a6420] mb-2">Match History</p>
        <h2 className="font-display text-[clamp(2.8rem,6vw,5rem)] text-[#dce6f4] mb-4">
          Results <span className="text-[#e0be58]">Archive</span>
        </h2>
        <p className="text-[#8090a8] text-base font-light leading-relaxed max-w-[540px]">
          A record of every match Shadow Raiders has played. Results are added after each game.
        </p>
      </div>

      {loading ? (
        <div className="text-[#4a5c72] font-mono-sr text-sm tracking-widest text-center py-20">Loading results...</div>
      ) : results.length === 0 ? (
        <div className="text-center py-24 border border-[rgba(255,255,255,0.06)] rounded-sm bg-[#07111e]">
          <div className="font-display text-5xl text-[#4a5c72] mb-4">◈</div>
          <p className="font-display text-2xl text-[#dce6f4] mb-2">No results yet</p>
          <p className="text-[#4a5c72] text-sm font-light">Results will appear here after each match. Check the schedule for upcoming games.</p>
        </div>
      ) : (
        <>
          {/* Win/Loss summary */}
          {results.length > 0 && (
            <div className="grid grid-cols-3 border border-[rgba(255,255,255,0.06)] rounded-sm overflow-hidden mb-8 bg-[#07111e]">
              {(['win','loss','draw'] as MatchOutcome[]).map(outcome => {
                const count = results.filter(r => r.outcome === outcome).length
                return (
                  <div key={outcome} className="p-6 text-center border-r border-[rgba(255,255,255,0.06)] last:border-0 relative">
                    <span className="font-display text-3xl block mb-1 text-[#dce6f4]">{count}</span>
                    <span className={`font-mono-sr text-[0.6rem] tracking-[0.18em] uppercase px-2 py-0.5 rounded ${OUTCOME_COLORS[outcome]}`}>
                      {outcome}s
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          <div className="flex flex-col gap-px bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] rounded-sm overflow-hidden">
            {results.map(result => {
              const colors = COMPETITION_COLORS[result.competition as Competition]
              const outcomeColor = result.outcome ? OUTCOME_COLORS[result.outcome] : 'text-[#4a5c72] border-[#4a5c72]'
              return (
                <div key={result.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-6 py-5 bg-[#0a1828] hover:bg-[#0e2035] transition-colors border-l-[3px]"
                  style={{ borderLeftColor: colors.border }}>
                  <div className="font-mono-sr text-[0.65rem] text-[#4a5c72] min-w-[90px]">{formatDate(result.date)}</div>
                  <span className={`font-mono-sr text-[0.58rem] tracking-[0.14em] uppercase px-2.5 py-1 rounded-sm border ${colors.badge} whitespace-nowrap`}>
                    {COMPETITION_LABELS[result.competition as Competition]}
                  </span>
                  <div className="flex-1">
                    <div className="text-[#dce6f4] text-sm font-semibold mb-0.5">{result.title}</div>
                    <div className="text-[#8090a8] text-sm font-light">vs <span className="text-[#dce6f4] font-semibold">{result.opponent}</span></div>
                  </div>
                  {(result.our_score !== undefined && result.their_score !== undefined) && (
                    <div className="font-display text-2xl text-[#dce6f4] tracking-widest">
                      {result.our_score} <span className="text-[#4a5c72] text-base">–</span> {result.their_score}
                    </div>
                  )}
                  {result.outcome && (
                    <span className={`font-mono-sr text-[0.58rem] tracking-[0.14em] uppercase px-2.5 py-1 rounded border ${outcomeColor}`}>
                      {result.outcome}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
