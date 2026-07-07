'use client'

const DISCORD_INVITE = 'https://discord.gg/cmuGSVXQFN'

const JOIN_STEPS = [
  {
    number: '01',
    title: 'Join the Discord',
    body: [
      'Start by joining our Discord server. This is where you can meet the community, ask questions, read our rules, and learn how the alliance works.',
      'Discord is required for anyone who wants to participate seriously.',
    ],
  },
  {
    number: '02',
    title: 'Enter Raiders Assembly',
    body: [
      'Raiders Assembly is our public community and recruitment hub. It is open to respectful and active players who want to be part of the Shadow Raiders environment.',
      'You do not need to be an expert to join the community. What matters most is attitude, activity, and willingness to work with others.',
    ],
  },
  {
    number: '03',
    title: 'Choose Your Direction',
    body: [
      'Once inside, players can follow one of several paths based on their goals, experience, and readiness for organized alliance play.',
    ],
  },
  {
    number: '04',
    title: 'Apply for a Tryout',
    body: [
      'Selected players may apply for a tryout. A tryout is not only about skill. We also look at communication, reliability, teamwork, attitude, and how well a player fits into the alliance.',
      'Players who are already in another alliance are not eligible to join Shadow Raiders unless they leave their current alliance first.',
    ],
  },
  {
    number: '05',
    title: 'Evaluation',
    body: [
      'Passing a tryout does not depend on one single match or one single moment. We look for players who can contribute consistently.',
    ],
  },
  {
    number: '06',
    title: 'Final Decision',
    body: [
      'After evaluation, leadership will decide whether the player is accepted into Shadow Raiders, directed toward the Academy, or encouraged to remain in Raiders Assembly until they are ready.',
      'Not every player will join the main team immediately, but every respectful and active player has a place to grow.',
    ],
  },
]

const PLAYER_PATHS = [
  {
    title: 'Community Member',
    desc: 'For players who want to be part of the community, join events, learn, and stay connected.',
  },
  {
    title: 'Academy Player',
    desc: 'For players who want to improve, learn team strategy, and prepare for more organized alliance gameplay.',
  },
  {
    title: 'Tryout Applicant',
    desc: 'For players who want to be evaluated for a possible place in Shadow Raiders.',
  },
]

const EVALUATION_CRITERIA = [
  'Activity and availability',
  'Communication on Discord',
  'Teamwork and discipline',
  'Game knowledge and decision-making',
  'Willingness to follow strategy',
  'Respect toward other players',
  'Long-term fit with the alliance',
]

export default function JoinPage() {
  return (
    <div style={{ background: 'radial-gradient(ellipse 100% 55% at 50% 0%, rgba(26,50,75,0.38) 0%, transparent 65%), #04090f' }}>
      <section className="relative overflow-hidden border-b border-[rgba(255,255,255,0.06)]">
        <div className="hero-grid absolute inset-0 opacity-70" />
        <div className="relative max-w-[1100px] mx-auto px-6 py-20 md:py-24">
          <p className="font-mono-sr text-[0.62rem] tracking-[0.3em] uppercase text-[#7a6420] mb-3">
            Recruitment · Raiders Assembly · Tryouts
          </p>
          <h1 className="font-display text-[clamp(3rem,7vw,5.8rem)] leading-[0.94] text-[#dce6f4] mb-6">
            Join Shadow <span className="text-[#e0be58]">Raiders</span>
          </h1>
          <div className="max-w-[720px] space-y-4 mb-9">
            <p className="text-[#8090a8] text-base md:text-lg font-light leading-relaxed">
              Shadow Raiders is built around discipline, teamwork, and competitive play. Whether you are an experienced player looking for serious alliance gameplay or a newer player hoping to improve, there is a clear path into our community.
            </p>
            <p className="text-[#8090a8] text-base md:text-lg font-light leading-relaxed">
              Our main communication platform is Discord. All applications, tryouts, announcements, and coordination take place there.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={DISCORD_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-10 py-3.5 bg-[#c8a840] text-[#04090f] text-sm font-semibold tracking-widest uppercase rounded-sm border border-[#e0be58] transition-all hover:bg-[#e0be58] hover:shadow-[0_4px_24px_rgba(200,168,64,0.35)] hover:-translate-y-px"
            >
              Join Discord
            </a>
            <a
              href="#join-path"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[#8090a8] text-sm font-medium tracking-widest uppercase rounded-sm border border-[#4a5c72] transition-all hover:border-[#7a6420] hover:text-[#c8a840] hover:-translate-y-px"
            >
              View Path
            </a>
          </div>
        </div>
      </section>

      <main className="max-w-[1100px] mx-auto px-6 py-16 md:py-20">
        <section id="join-path" className="mb-16 scroll-mt-24" aria-labelledby="join-path-title">
          <div className="mb-10">
            <p className="font-mono-sr text-[0.62rem] tracking-[0.3em] uppercase text-[#7a6420] mb-2">Six Step Path</p>
            <h2 id="join-path-title" className="font-display text-[clamp(2.2rem,5vw,3.6rem)] text-[#dce6f4]">
              From Discord to Tryout
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] rounded-sm overflow-hidden">
            {JOIN_STEPS.map(step => (
              <article key={step.number} className="group p-7 md:p-8 bg-[#0a1828] hover:bg-[#0e2035] transition-colors relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,#c8a840,transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start gap-5">
                  <div className="font-mono-sr text-[#c8a840] text-[0.68rem] tracking-[0.2em] border border-[#7a6420] bg-[rgba(200,168,64,0.04)] rounded-sm px-2.5 py-2 flex-shrink-0">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="font-display text-2xl text-[#dce6f4] mb-3">{step.title}</h3>
                    <div className="space-y-3">
                      {step.body.map((paragraph, index) => (
                        <p key={index} className="text-[#8090a8] text-sm font-light leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-16" aria-labelledby="direction-title">
          <div className="mb-8 text-center">
            <p className="font-mono-sr text-[0.62rem] tracking-[0.3em] uppercase text-[#2e4f6a] mb-2">Choose Your Direction</p>
            <h2 id="direction-title" className="font-display text-3xl md:text-4xl text-[#dce6f4]">Three Ways to Grow</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] rounded-sm overflow-hidden">
            {PLAYER_PATHS.map((path, index) => (
              <article key={path.title} className="p-8 bg-[#07111e] hover:bg-[#0a1828] transition-colors relative">
                <div className="font-mono-sr text-[0.58rem] tracking-[0.22em] uppercase text-[#4a5c72] mb-3">
                  Path {index + 1}
                </div>
                <h3 className="font-display text-2xl text-[#7ca0c2] mb-3">{path.title}</h3>
                <p className="text-[#8090a8] text-sm font-light leading-relaxed">{path.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-16 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-px bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] rounded-sm overflow-hidden" aria-labelledby="evaluation-title">
          <div className="p-9 bg-[rgba(20,38,60,0.62)] border-b lg:border-b-0 lg:border-r border-[rgba(255,255,255,0.06)]">
            <p className="font-mono-sr text-[0.62rem] tracking-[0.3em] uppercase text-[#7a6420] mb-2">Evaluation</p>
            <h2 id="evaluation-title" className="font-display text-3xl md:text-4xl text-[#dce6f4] mb-4">What Leadership Reviews</h2>
            <p className="text-[#8090a8] text-sm font-light leading-relaxed">
              Evaluation is based on consistency, communication, and fit with the alliance. One match does not define a player; repeated conduct does.
            </p>
          </div>
          <div className="p-9 bg-[#0a1828]">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EVALUATION_CRITERIA.map(item => (
                <li key={item} className="text-[#dce6f4] text-sm font-light leading-relaxed pl-5 relative">
                  <span className="absolute left-0 text-[#c8a840] text-xs top-0.5">–</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-16 p-9 md:p-11 bg-[rgba(14,32,53,0.52)] border border-[rgba(200,168,64,0.15)] border-l-2 border-l-[#c8a840] rounded-r-sm" aria-labelledby="expect-title">
          <p className="font-mono-sr text-[0.62rem] tracking-[0.3em] uppercase text-[#7a6420] mb-2">Standards</p>
          <h2 id="expect-title" className="font-display text-3xl md:text-4xl text-[#dce6f4] mb-4">What We Expect</h2>
          <p className="text-[#8090a8] text-base font-light leading-relaxed max-w-[760px]">
            Shadow Raiders members are expected to be active, respectful, disciplined, and team-oriented. We value players who communicate clearly, support their teammates, and represent the alliance well. Skill matters, but character matters just as much.
          </p>
        </section>

        <section className="text-center p-10 md:p-14 bg-[#07111e] border border-[rgba(255,255,255,0.06)] rounded-sm" aria-labelledby="ready-title">
          <p className="font-mono-sr text-[0.62rem] tracking-[0.3em] uppercase text-[#4a5c72] mb-2">Ready to Begin?</p>
          <h2 id="ready-title" className="font-display text-3xl md:text-4xl text-[#dce6f4] mb-3">Start Your Path Through Raiders Assembly</h2>
          <p className="text-[#8090a8] text-sm font-light leading-relaxed max-w-[560px] mx-auto mb-8">
            Join our Discord, introduce yourself, and begin the process with the community.
          </p>
          <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-10 py-3.5 bg-[#c8a840] text-[#04090f] text-sm font-semibold tracking-widest uppercase rounded-sm border border-[#e0be58] transition-all hover:bg-[#e0be58] hover:shadow-[0_4px_24px_rgba(200,168,64,0.35)] hover:-translate-y-px"
          >
            Join Discord
          </a>
        </section>
      </main>
    </div>
  )
}
