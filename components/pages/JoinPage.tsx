'use client'

type PathCard = {
  title: string
  label: string
  text: string[]
  requirements?: string[]
  ctaText: string
  ctaUrl: string
  featured?: boolean
}

type AssemblyStep = {
  number: string
  title: string
  text: string
  ctaText?: string
  ctaUrl?: string
}

const ELITE_DISCORD = 'https://discord.gg/cW8CefYnYt'
const ASSEMBLY_DISCORD = 'https://discord.gg/e7c3DDaJmp'

const PATH_CARDS: PathCard[] = [
  {
    title: 'Elite / Experienced Players',
    label: 'Direct Elite Path',
    text: [
      'This path is for players who are already experienced and ready for competitive alliance gameplay.',
    ],
    requirements: [
      'Rank 35+',
      'K/D of 1.5 or higher',
      'Active and reliable',
      'Able to communicate through Discord',
      'Willing to follow alliance strategy',
    ],
    ctaText: 'Join Shadow Raiders Discord',
    ctaUrl: ELITE_DISCORD,
    featured: true,
  },
  {
    title: 'Newer / Developing Players',
    label: 'Development Path',
    text: [
      'This path is for newer players, returning players, or anyone who wants to improve before applying for the elite team.',
      'You should begin in Raiders Assembly, our public community and development hub. There, you can meet other members, play games together, improve your skill, and prepare for a future Shadow Raiders tryout.',
    ],
    ctaText: 'Join Raiders Assembly Discord',
    ctaUrl: ASSEMBLY_DISCORD,
  },
]

const ASSEMBLY_STEPS: AssemblyStep[] = [
  {
    number: '01',
    title: 'Join the Discord',
    text: 'Join the Raiders Assembly Discord server. This is where community activity, announcements, and tryout information are handled.',
    ctaText: 'Join Discord',
    ctaUrl: ASSEMBLY_DISCORD,
  },
  {
    number: '02',
    title: 'Verify and Meet the Community',
    text: 'After joining, verify yourself, read the rules, and introduce yourself to the community. This helps staff and members get to know you.',
  },
  {
    number: '03',
    title: 'Play and Improve',
    text: 'Join games with other Raiders Assembly members, learn from experienced players, and improve your teamwork, activity, and game knowledge. The goal is not only to become better individually, but also to learn how to play as part of an organized team.',
  },
  {
    number: '04',
    title: 'Apply for a Tryout',
    text: 'When you believe you are ready for the elite team, apply for a tryout in the Apply for Tryout channel on Discord. Tryouts are used to evaluate whether a player is ready for Shadow Raiders.',
  },
  {
    number: '05',
    title: 'Complete the Tryout',
    text: 'Join the tryout and show your skill, communication, teamwork, and discipline. If you are successful, you may be accepted into Shadow Raiders. If you are not successful, you may reapply after 2 weeks and try again.',
  },
]

export default function JoinPage() {
  return (
    <div style={{ background: 'radial-gradient(ellipse 100% 55% at 50% 0%, rgba(26,50,75,0.38) 0%, transparent 65%), #04090f' }}>
      <section className="relative overflow-hidden border-b border-[rgba(255,255,255,0.06)]">
        <div className="hero-grid absolute inset-0 opacity-70" />
        <div className="relative max-w-[1100px] mx-auto px-6 py-20 md:py-24">
          <p className="font-mono-sr text-[0.62rem] tracking-[0.3em] uppercase text-[#7a6420] mb-3">
            Recruitment Paths
          </p>
          <h1 className="font-display text-[clamp(3rem,7vw,5.8rem)] leading-[0.94] text-[#dce6f4] mb-5">
            Join Shadow <span className="text-[#e0be58]">Raiders</span>
          </h1>
          <p className="text-[#8090a8] text-base md:text-lg font-light leading-relaxed max-w-[620px] mb-9">
            Choose the path that fits your current experience level.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#7a6420] text-[#c8a840] font-mono-sr text-[0.58rem] tracking-[0.18em] uppercase">
            <span className="w-[5px] h-[5px] rounded-full bg-[#c8a840] animate-blink" />
            Discord Handles Applications and Tryouts
          </div>
        </div>
      </section>

      <main className="max-w-[1100px] mx-auto px-6 py-16 md:py-20">
        <section className="mb-16" aria-labelledby="choose-path-title">
          <div className="mb-9">
            <p className="font-mono-sr text-[0.62rem] tracking-[0.3em] uppercase text-[#7a6420] mb-2">Choose Your Entry Point</p>
            <h2 id="choose-path-title" className="font-display text-[clamp(2.2rem,5vw,3.6rem)] text-[#dce6f4]">
              Two Clear Paths
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] rounded-sm overflow-hidden">
            {PATH_CARDS.map(path => (
              <article key={path.title} className={`group p-8 md:p-10 transition-colors relative ${path.featured ? 'bg-[rgba(14,32,53,0.72)] hover:bg-[#0e2035]' : 'bg-[#0a1828] hover:bg-[#0e2035]'}`}>
                <div className={`absolute top-0 left-0 right-0 h-px ${path.featured ? 'bg-[linear-gradient(90deg,transparent,#c8a840,transparent)]' : 'bg-[linear-gradient(90deg,transparent,#5a82a8,transparent)]'} opacity-80`} />
                <p className={`font-mono-sr text-[0.58rem] tracking-[0.22em] uppercase mb-3 ${path.featured ? 'text-[#7a6420]' : 'text-[#2e4f6a]'}`}>
                  {path.label}
                </p>
                <h3 className="font-display text-3xl md:text-4xl text-[#dce6f4] mb-5">{path.title}</h3>
                <div className="space-y-3 mb-7">
                  {path.text.map(paragraph => (
                    <p key={paragraph} className="text-[#8090a8] text-sm font-light leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {path.requirements && (
                  <div className="mb-8">
                    <div className="text-[#c8a840] text-[0.68rem] font-semibold tracking-[0.18em] uppercase mb-4 flex items-center gap-3">
                      <span className="w-4 h-px bg-[#c8a840] opacity-50" />Requirements
                    </div>
                    <ul className="flex flex-col gap-2.5">
                      {path.requirements.map(item => (
                        <li key={item} className="text-[#dce6f4] text-sm font-light leading-relaxed pl-5 relative">
                          <span className="absolute left-0 text-[#c8a840] text-xs top-0.5">-</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <a
                  href={path.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 text-sm font-semibold tracking-widest uppercase rounded-sm border transition-all hover:-translate-y-px ${path.featured ? 'bg-[#c8a840] text-[#04090f] border-[#e0be58] hover:bg-[#e0be58] hover:shadow-[0_4px_24px_rgba(200,168,64,0.35)]' : 'text-[#7ca0c2] border-[#2e4f6a] hover:bg-[rgba(90,130,168,0.1)] hover:border-[#5a82a8] hover:shadow-[0_4px_20px_rgba(90,130,168,0.25)]'}`}
                >
                  {path.ctaText}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="raiders-assembly-path" className="mb-16 scroll-mt-24" aria-labelledby="assembly-path-title">
          <div className="mb-9">
            <p className="font-mono-sr text-[0.62rem] tracking-[0.3em] uppercase text-[#2e4f6a] mb-2">Development Route</p>
            <h2 id="assembly-path-title" className="font-display text-[clamp(2.2rem,5vw,3.6rem)] text-[#dce6f4]">
              Raiders Assembly Path
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-px bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] rounded-sm overflow-hidden">
            {ASSEMBLY_STEPS.map(step => (
              <article key={step.number} className="group p-7 md:p-8 bg-[#0a1828] hover:bg-[#0e2035] transition-colors relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,#5a82a8,transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex flex-col md:flex-row md:items-start gap-5">
                  <div className="font-mono-sr text-[#7ca0c2] text-[0.68rem] tracking-[0.2em] border border-[#2e4f6a] bg-[rgba(90,130,168,0.05)] rounded-sm px-2.5 py-2 flex-shrink-0 w-fit">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl text-[#dce6f4] mb-3">{step.title}</h3>
                    <p className="text-[#8090a8] text-sm font-light leading-relaxed max-w-[820px]">
                      {step.text}
                    </p>
                    {step.ctaText && step.ctaUrl && (
                      <a
                        href={step.ctaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 mt-5 px-7 py-3 text-[#7ca0c2] text-xs font-semibold tracking-widest uppercase rounded-sm border border-[#2e4f6a] transition-all hover:bg-[rgba(90,130,168,0.1)] hover:border-[#5a82a8] hover:-translate-y-px"
                      >
                        {step.ctaText}
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="text-center p-10 md:p-14 bg-[#07111e] border border-[rgba(255,255,255,0.06)] rounded-sm" aria-labelledby="discord-note-title">
          <p className="font-mono-sr text-[0.62rem] tracking-[0.3em] uppercase text-[#4a5c72] mb-2">Discord First</p>
          <h2 id="discord-note-title" className="font-display text-3xl md:text-4xl text-[#dce6f4] mb-3">Applications Stay on Discord</h2>
          <p className="text-[#8090a8] text-sm font-light leading-relaxed max-w-[650px] mx-auto mb-8">
            Verification, community activity, applications, and tryout coordination all happen on Discord. The website only explains the path so every player knows where to begin.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a
              href={ELITE_DISCORD}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#c8a840] text-[#04090f] text-sm font-semibold tracking-widest uppercase rounded-sm border border-[#e0be58] transition-all hover:bg-[#e0be58] hover:shadow-[0_4px_24px_rgba(200,168,64,0.35)] hover:-translate-y-px"
            >
              Elite Discord
            </a>
            <a
              href={ASSEMBLY_DISCORD}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[#7ca0c2] text-sm font-semibold tracking-widest uppercase rounded-sm border border-[#2e4f6a] transition-all hover:bg-[rgba(90,130,168,0.1)] hover:border-[#5a82a8] hover:-translate-y-px"
            >
              Raiders Assembly
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
