'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { FaqItem } from '@/lib/types'

const FALLBACK: FaqItem[] = [
  { id:'1', sort_order:1, question:"What if I don't meet the rank or K/D requirements?", answer:"Apply to the Raiders Academy. There you can learn, develop, and improve over time — and once you meet the standards, you'll graduate directly into Shadow Raiders.", created_at:'', updated_at:'' },
  { id:'2', sort_order:2, question:"What AvA leagues does Shadow Raiders compete in?", answer:"We currently play in Rise League and CFC. We are also launching our own tournament — the Alliance Masters Series (AMS) — starting June 2026.", created_at:'', updated_at:'' },
  { id:'3', sort_order:3, question:"Can I bring a friend?", answer:"Absolutely. Friends are welcome to apply together. Each applicant is reviewed individually against our standard requirements.", created_at:'', updated_at:'' },
  { id:'4', sort_order:4, question:"Do I need to speak English?", answer:"Yes — English is a key requirement. Being fluent is ideal, but being fast and reliable with a translator is also acceptable.", created_at:'', updated_at:'' },
  { id:'5', sort_order:5, question:"Do I need to join voice chat?", answer:"Joining voice for Alliance games may be required when coordinating AvA operations. As a regular member outside of those moments, you are not required to speak.", created_at:'', updated_at:'' },
  { id:'6', sort_order:6, question:"Is there an age requirement?", answer:"No — there is no minimum age. What we do expect is that every member meets our character and behavioural standards. Maturity matters more than age.", created_at:'', updated_at:'' },
  { id:'7', sort_order:7, question:"What timezone should I be in?", answer:"We have members from all over the world. Most AvA wars run between 15:00–19:00 GMT, so players based in Europe or North America benefit most from the scheduling.", created_at:'', updated_at:'' },
]

export default function FaqPage() {
  const [items, setItems] = useState<FaqItem[]>(FALLBACK)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('faq')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        if (data && data.length > 0) setItems(data)
        setLoading(false)
      })
  }, [])

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-20">
      <div className="mb-14">
        <p className="font-mono-sr text-[0.62rem] tracking-[0.3em] uppercase text-[#7a6420] mb-2">Common Questions</p>
        <h2 className="font-display text-[clamp(2.8rem,6vw,5rem)] text-[#dce6f4] mb-4">FAQ</h2>
        <p className="text-[#8090a8] text-base font-light leading-relaxed max-w-[540px]">
          Everything you need to know before applying. Still have a question? DM <span className="text-[#c8a840]">Marc1809</span> on Discord.
        </p>
      </div>

      {loading ? (
        <div className="text-[#4a5c72] font-mono-sr text-sm tracking-widest text-center py-20">Loading...</div>
      ) : (
        <div className="flex flex-col gap-px bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] rounded-sm overflow-hidden mb-10">
          {items.map(item => (
            <div key={item.id} className="bg-[#0a1828] hover:bg-[#0e2035] transition-colors">
              <button
                className="w-full text-left px-6 py-5 flex items-start gap-4 cursor-pointer bg-transparent border-none"
                onClick={() => setOpen(open === item.id ? null : item.id)}
              >
                <span className="font-mono-sr text-[0.6rem] text-[#c8a840] mt-0.5 flex-shrink-0">Q</span>
                <span className="text-[#dce6f4] text-sm font-semibold flex-1 leading-relaxed text-left">{item.question}</span>
                <span className="text-[#4a5c72] text-sm flex-shrink-0 transition-transform duration-200" style={{ transform: open === item.id ? 'rotate(180deg)' : 'none' }}>
                  ▾
                </span>
              </button>
              {open === item.id && (
                <div className="px-6 pb-5 pl-[calc(1.5rem+1rem)]">
                  <p className="text-[#8090a8] text-sm font-light leading-relaxed border-t border-[rgba(255,255,255,0.04)] pt-4">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Contact card */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-8 bg-[#07111e] border border-[rgba(255,255,255,0.06)] rounded-sm">
        <div className="flex-1">
          <p className="text-[#8090a8] text-sm font-light">Still have a question not covered here?</p>
          <p className="font-mono-sr text-[#c8a840] text-sm mt-1 tracking-wide">Marc1809</p>
          <p className="text-[#4a5c72] text-xs font-light">Discord — DM directly</p>
        </div>
        <a href="https://discord.gg/cmuGSVXQFN" target="_blank" rel="noopener noreferrer"
          className="px-8 py-3 border border-[#7a6420] text-[#c8a840] text-sm font-semibold tracking-widest uppercase rounded-sm transition-all hover:bg-[#c8a840] hover:text-[#04090f] whitespace-nowrap">
          Open Discord
        </a>
      </div>
    </div>
  )
}
