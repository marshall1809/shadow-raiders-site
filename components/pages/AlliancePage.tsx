'use client'

export default function AlliancePage() {
  return (
    <div className="max-w-[1100px] mx-auto px-6 py-20">
      {/* Header */}
      <div className="mb-14">
        <p className="font-mono-sr text-[0.62rem] tracking-[0.3em] uppercase text-[#7a6420] mb-2">Primary Unit · Elite Tier</p>
        <h2 className="font-display text-[clamp(2.8rem,6vw,5rem)] text-[#dce6f4] mb-4">
          Shadow <span className="text-[#e0be58]">Raiders</span>
        </h2>
        <p className="text-[#8090a8] text-base font-light leading-relaxed max-w-[580px] mb-5">
          Shadow Raiders is not a casual alliance. We are a disciplined, coordinated team built for players who want
          elite-level competition, real strategy, and a professional environment. Every member earned their place.
        </p>
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#7a6420] text-[#c8a840] font-mono-sr text-[0.58rem] tracking-[0.18em] uppercase">
          <span className="w-[5px] h-[5px] rounded-full bg-[#c8a840] animate-blink" />
          Elite Status — Recruiting
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border border-[rgba(255,255,255,0.06)] rounded-sm overflow-hidden mb-10">
        {[
          { n: '35+', l: 'Rank Required' },
          { n: '1.0+', l: 'Minimum K/D' },
          { n: '100%', l: 'Team Commitment' },
        ].map((s, i) => (
          <div key={i} className="p-8 text-center bg-[#07111e] border-b sm:border-b-0 sm:border-r border-[rgba(255,255,255,0.06)] last:border-0 relative">
            <div className="absolute top-0 left-[20%] right-[20%] h-px bg-[#c8a840] opacity-30" />
            <span className="font-display text-[2.8rem] leading-none text-[#e0be58] block mb-1">{s.n}</span>
            <span className="font-mono-sr text-[0.6rem] tracking-[0.18em] uppercase text-[#4a5c72]">{s.l}</span>
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] rounded-sm overflow-hidden mb-6">
        {/* Offers */}
        <div className="group p-9 bg-[#0a1828] hover:bg-[#0e2035] transition-colors relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,#c8a840,transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="text-[#c8a840] text-[0.68rem] font-semibold tracking-[0.18em] uppercase mb-5 flex items-center gap-3">
            <span className="w-4 h-px bg-[#c8a840] opacity-50" />What We Offer
          </div>
          <ul className="flex flex-col gap-3">
            {[
              'Organized AvA operations with a clear chain of command',
              'Rise League, CFC, and the Alliance Masters Series (AMS)',
              'Coordinated dominance across public lobbies',
              'Advanced strategic planning — nothing improvised',
              'Access to an elite international player network',
              'Dedicated German-speaking coordination team',
              'A professional environment where members feel at home',
            ].map((item, i) => (
              <li key={i} className="text-[#dce6f4] text-sm font-light leading-relaxed pl-5 relative">
                <span className="absolute left-0 text-[#c8a840] text-xs top-0.5">–</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Requirements */}
        <div className="group p-9 bg-[#0a1828] hover:bg-[#0e2035] transition-colors relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,#c8a840,transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="text-[#c8a840] text-[0.68rem] font-semibold tracking-[0.18em] uppercase mb-5 flex items-center gap-3">
            <span className="w-4 h-px bg-[#c8a840] opacity-50" />Requirements
          </div>
          <div className="flex flex-col">
            {[
              { icon: '★', title: 'Rank 35+', desc: 'Proven field experience is mandatory.' },
              { icon: '⚡', title: 'K/D of 1.0 or higher', desc: 'Consistent, smart play is the baseline.' },
              { icon: '◉', title: 'Active in AvA & regular games', desc: 'Shadow Raiders show up for every campaign.' },
              { icon: '✦', title: 'Fluent in English', desc: 'Or fast with a translator — clear comms are essential.' },
              { icon: '▲', title: 'Active on Discord', desc: 'All coordination runs through our command channel.' },
            ].map((req, i) => (
              <div key={i} className="flex gap-4 py-3.5 border-b border-[rgba(255,255,255,0.04)] last:border-0 last:pb-0 items-start">
                <div className="w-[30px] h-[30px] min-w-[30px] flex items-center justify-center text-xs border border-[#7a6420] text-[#c8a840] bg-[rgba(200,168,64,0.04)] rounded-sm flex-shrink-0">
                  {req.icon}
                </div>
                <div>
                  <div className="text-[#dce6f4] text-sm font-semibold mb-0.5">{req.title}</div>
                  <div className="text-[#8090a8] text-xs font-light">{req.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center p-14 bg-[rgba(14,32,53,0.5)] border border-[rgba(200,168,64,0.15)] rounded-sm">
        <h3 className="font-display text-3xl text-[#dce6f4] mb-2">Ready to Compete at the Highest Level?</h3>
        <p className="text-[#8090a8] text-sm font-light mb-8">Apply via Discord. We review every applicant individually — friends welcome.</p>
        <a href="https://discord.gg/cmuGSVXQFN" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-10 py-3.5 bg-[#c8a840] text-[#04090f] text-sm font-semibold tracking-widest uppercase rounded-sm border border-[#e0be58] transition-all hover:bg-[#e0be58] hover:shadow-[0_4px_24px_rgba(200,168,64,0.35)] hover:-translate-y-px">
          Join Shadow Raiders
        </a>
        <p className="text-[#4a5c72] text-xs mt-4">
          Questions? DM <span className="text-[#c8a840] font-medium">Marc1809</span> on Discord.
        </p>
      </div>
    </div>
  )
}
