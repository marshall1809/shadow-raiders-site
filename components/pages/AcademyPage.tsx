'use client'

export default function AcademyPage() {
  return (
    <div style={{ background: 'radial-gradient(ellipse 100% 55% at 50% 0%, rgba(26,50,75,0.45) 0%, transparent 65%), #07111e' }}>
      <div className="max-w-[1100px] mx-auto px-6 py-20">

        {/* Header */}
        <div className="mb-14">
          <p className="font-mono-sr text-[0.62rem] tracking-[0.3em] uppercase text-[#2e4f6a] mb-2">Training Division · Entry Path</p>
          <h2 className="font-display text-[clamp(2.4rem,5vw,4rem)] text-[rgba(220,230,244,0.92)] mb-4">
            Raiders <span className="text-[#7ca0c2]">Academy</span>
          </h2>
          <p className="text-[#8090a8] text-base font-light leading-relaxed max-w-[580px] mb-5 italic">
            Per aspera ad astra — through hardships to the stars. A structured training programme where new and developing
            players build the skills and discipline needed to earn a place in the main Alliance.
          </p>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2e4f6a] text-[#5a82a8] font-mono-sr text-[0.58rem] tracking-[0.18em] uppercase">
            <span className="w-[5px] h-[5px] rounded-full bg-[#5a82a8] animate-blink" />
            Open Enrollment
          </span>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] rounded-sm overflow-hidden mb-6">
          <div className="group p-9 bg-[#0a1828] hover:bg-[#0e2035] transition-colors relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,#5a82a8,transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-[#5a82a8] text-[0.68rem] font-semibold tracking-[0.18em] uppercase mb-5 flex items-center gap-3">
              <span className="w-4 h-px bg-[#5a82a8] opacity-50" />What the Academy Offers
            </div>
            <ul className="flex flex-col gap-3">
              {[
                'Personalised coaching from veteran Shadow Raiders',
                'Internal Alliance games to develop tactical skills',
                'Organised public match sessions with live feedback',
                'A non-toxic, beginner-friendly environment',
                'A clear, transparent path into the main Alliance',
              ].map((item, i) => (
                <li key={i} className="text-[#dce6f4] text-sm font-light leading-relaxed pl-5 relative">
                  <span className="absolute left-0 text-[#5a82a8] text-xs top-0.5">–</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="group p-9 bg-[#0a1828] hover:bg-[#0e2035] transition-colors relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,#5a82a8,transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-[#5a82a8] text-[0.68rem] font-semibold tracking-[0.18em] uppercase mb-5 flex items-center gap-3">
              <span className="w-4 h-px bg-[#5a82a8] opacity-50" />Entry Requirements
            </div>
            <div className="flex flex-col">
              {[
                { icon: '◈', title: 'Basic game knowledge', desc: 'Know the fundamentals. Attitude matters more than rank.' },
                { icon: '◎', title: 'Willingness to learn', desc: 'Open to coaching and honest feedback.' },
                { icon: '✦', title: 'Active participation', desc: 'Show up, engage, and keep improving.' },
                { icon: '▲', title: 'Fluent in English', desc: 'Clear communication is essential from day one.' },
              ].map((req, i) => (
                <div key={i} className="flex gap-4 py-3.5 border-b border-[rgba(255,255,255,0.04)] last:border-0 last:pb-0 items-start">
                  <div className="w-[30px] h-[30px] min-w-[30px] flex items-center justify-center text-xs border border-[#2e4f6a] text-[#5a82a8] bg-[rgba(90,130,168,0.04)] rounded-sm flex-shrink-0">
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

        {/* Progression */}
        <div className="border-t border-[rgba(255,255,255,0.06)] pt-12 mb-6">
          <p className="font-mono-sr text-[0.62rem] tracking-[0.3em] uppercase text-[#7a6420] mb-2 text-center">Advancement</p>
          <h3 className="font-display text-3xl text-[#dce6f4] mb-8 text-center">The Path to <span className="text-[#e0be58]">Elite</span></h3>

          <div className="flex flex-col md:flex-row items-stretch">
            <div className="flex-1 p-10 text-center bg-[rgba(20,38,60,0.6)] border border-[rgba(90,130,168,0.2)] md:border-r-0 relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,#5a82a8,transparent)]" />
              <div className="font-mono-sr text-[0.58rem] tracking-[0.22em] uppercase text-[#4a5c72] mb-2">Phase I — Entry</div>
              <div className="font-display text-[1.8rem] text-[#7ca0c2] mb-5">Raiders Academy</div>
              <ul className="text-left flex flex-col gap-2">
                {['Onboarding and orientation','Strategy fundamentals coaching','Internal and public training games','Performance review by senior members','Milestone-based skill development'].map((p,i)=>(
                  <li key={i} className="text-[#8090a8] text-sm font-light pl-4 relative"><span className="absolute left-0 text-[#5a82a8]">›</span>{p}</li>
                ))}
              </ul>
            </div>
            <div className="flex-none w-full md:w-16 flex items-center justify-center py-4 md:py-0 border-t md:border-t-0 border-b md:border-b-0 border-[rgba(255,255,255,0.06)]">
              <span className="text-[#7a6420] text-2xl animate-nudge md:block rotate-90 md:rotate-0">→</span>
            </div>
            <div className="flex-1 p-10 text-center bg-[rgba(14,30,52,0.6)] border border-[rgba(200,168,64,0.18)] md:border-l-0 relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,#c8a840,transparent)]" />
              <div className="font-mono-sr text-[0.58rem] tracking-[0.22em] uppercase text-[#4a5c72] mb-2">Phase II — Elite</div>
              <div className="font-display text-[1.8rem] text-[#dce6f4] mb-5">Shadow Raiders</div>
              <ul className="text-left flex flex-col gap-2">
                {['Full Alliance membership','AvA and Tournament access','High-level coordinated operations','Elite international network','Represent Shadow Raiders at the top'].map((p,i)=>(
                  <li key={i} className="text-[#8090a8] text-sm font-light pl-4 relative"><span className="absolute left-0 text-[#c8a840]">›</span>{p}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4 p-5 bg-[#0a1828] border border-[rgba(255,255,255,0.06)] border-l-2 border-l-[#c8a840] rounded-r-sm text-[#8090a8] text-sm font-light leading-relaxed italic">
            <strong className="text-[#e0be58] not-italic font-semibold">Promotion is earned, not given.</strong> Academy members who demonstrate consistent improvement, discipline, and tactical awareness are reviewed for promotion. There is no fixed timeline — performance is the only measure.
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-14 bg-[rgba(15,30,50,0.5)] border border-[rgba(90,130,168,0.2)] rounded-sm">
          <h3 className="font-display text-3xl text-[#dce6f4] mb-2">Begin Your Journey</h3>
          <p className="text-[#8090a8] text-sm font-light mb-8">Not yet at Alliance level? The Academy is where it starts.</p>
          <a href="https://discord.gg/e7c3DDaJmp" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-10 py-3.5 text-[#7ca0c2] text-sm font-semibold tracking-widest uppercase rounded-sm border border-[#2e4f6a] transition-all hover:bg-[rgba(90,130,168,0.1)] hover:border-[#5a82a8] hover:shadow-[0_4px_20px_rgba(90,130,168,0.25)] hover:-translate-y-px">
            Join Raiders Academy
          </a>
          <p className="text-[#4a5c72] text-xs mt-4">
            Questions? DM <span className="text-[#7ca0c2] font-medium">Marc1809</span> on Discord.
          </p>
        </div>
      </div>
    </div>
  )
}
