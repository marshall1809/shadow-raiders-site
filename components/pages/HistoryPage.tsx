'use client'

const TIMELINE = [
  {
    dot: '◎',
    year: 'June 2022 — Origins',
    title: 'A Group of Friends',
    desc: 'Marc1809 gathers a small circle of friends and players met through games. No formal structure yet — just a shared enjoyment of playing together. The seed that would grow into everything that followed.',
  },
  {
    dot: '✦',
    year: 'April 1, 2023 — Foundation',
    title: 'Raiders CoN is Founded',
    desc: 'The alliance is officially created with a starting group of 12 members. What began as a circle of familiar faces quickly became something larger as word spread and the community opened its doors.',
  },
  {
    dot: '⚔',
    year: 'May – July 2023 — First Competition',
    title: 'Shadow League — First Tournament',
    desc: 'Just weeks after founding, Raiders CoN enters its first competitive tournament: the Shadow League. An early test of the team\'s cohesion and ambition — and a sign of things to come.',
  },
  {
    dot: '★',
    year: 'December 24, 2023 — Growth',
    title: '300 Members',
    desc: 'By Christmas Eve 2023 — less than nine months after founding — Raiders CoN surpasses 300 members. A remarkable rate of growth, driven by a welcoming culture and strong leadership.',
  },
  {
    dot: '◈',
    year: 'September 2024 — Expansion',
    title: 'Closing in on 600 Members',
    desc: 'Raiders CoN approaches 600 members, firmly establishing itself as one of the largest and most active alliances in the game. Its reputation for being non-toxic and well-run continues to attract players.',
  },
  {
    dot: '▲',
    year: 'March 2025 — Scale',
    title: '700 Members Reached',
    desc: 'The alliance reaches 700 members, placing it consistently among the top alliances. The foundations built over two years of steady, principled leadership are paying off.',
  },
  {
    dot: '◉',
    year: '2025 — Peak',
    title: '1,000 Members — Top 3 Alliance',
    desc: 'Raiders CoN reaches 1,000 members — one of only three alliances in the game to achieve that scale. A milestone that validated years of community building and consistent leadership.',
  },
  {
    dot: '→',
    year: 'Late 2025 — Transformation',
    title: 'Shadow Raiders Alliance is Born',
    desc: 'A deliberate decision to shift from quantity to quality. Shadow Raiders is created as a smaller, elite unit — purpose-built to compete for AvA victories and league titles. The Raiders Academy is established alongside it to develop the next generation of players.',
  },
  {
    dot: '✦',
    year: '2026 — Present',
    title: 'Competing at the Top Level',
    desc: 'With the same ownership and a command team refined over years of collaboration, Shadow Raiders competes in Rise League, CFC, and the inaugural Alliance Masters Series (AMS) — continuing to raise the bar for what a gaming alliance can be.',
    highlight: true,
  },
]

const QUOTES = [
  { text: 'There are many great people there.', attr: 'Anonymous SR Member' },
  { text: "Marc's daily good morning messages are always a fun competition to see who answers back first.", attr: 'Him — SR Member' },
  { text: 'A place where I feel at home and welcome.', attr: 'Anonymous SR Member' },
  { text: 'No matter how bad your day is, you can go online and meet people who live thousands of miles away who will have a fun conversation with you.', attr: 'Anonymous SR Member' },
  { text: 'I miss the team.', attr: 'Former RC Member', faded: true },
]

export default function HistoryPage() {
  return (
    <div className="max-w-[1100px] mx-auto px-6 py-20">

      {/* Header */}
      <div className="mb-14">
        <p className="font-mono-sr text-[0.62rem] tracking-[0.3em] uppercase text-[#7a6420] mb-2">Our Story</p>
        <h2 className="font-display text-[clamp(2.8rem,6vw,5rem)] text-[#dce6f4] mb-4">
          Team <span className="text-[#e0be58]">History</span>
        </h2>
      </div>

      {/* Two-col layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 mb-20">

        {/* Aside */}
        <div>
          <p className="text-[#8090a8] text-base font-light leading-relaxed mb-8">
            From a small group of friends to one of Supremacy WW3&apos;s most respected alliances.
            Built on consistent leadership, high standards, and genuine team culture since 2023.
          </p>
          <div className="pl-5 border-l-2 border-[#c8a840] py-1">
            <p className="text-[#8090a8] text-sm font-light italic leading-relaxed">
              &ldquo;The owner has remained the same throughout the years. The command team has gathered years of shared
              experience — producing{' '}
              <strong className="text-[#e0be58] not-italic font-medium">high standards, a professional environment,</strong>
              {' '}and a team where members feel genuinely welcome.&rdquo;
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex flex-col gap-0">
          {TIMELINE.map((item, i) => (
            <div key={i} className="flex gap-6 relative">
              {/* Vertical connector */}
              {i < TIMELINE.length - 1 && (
                <div className="absolute left-[0.85rem] top-9 bottom-0 w-px bg-[rgba(255,255,255,0.06)]" />
              )}
              {/* Dot */}
              <div className="flex-shrink-0 z-10 pt-0.5">
                <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-[0.6rem] ${
                  item.highlight
                    ? 'border-[#c8a840] text-[#e0be58] bg-[#0a1828]'
                    : 'border-[#7a6420] text-[#c8a840] bg-[#07111e]'
                }`}>
                  {item.dot}
                </div>
              </div>
              {/* Content */}
              <div className="pb-10 last:pb-0 flex-1">
                <div className="font-mono-sr text-[0.6rem] tracking-[0.2em] uppercase text-[#c8a840] mb-1">{item.year}</div>
                <div className="text-[#dce6f4] text-sm font-semibold mb-2">{item.title}</div>
                <p className="text-[#8090a8] text-sm font-light leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Member quotes */}
      <div>
        <p className="font-mono-sr text-[0.62rem] tracking-[0.3em] uppercase text-[#7a6420] mb-8 text-center">In Their Own Words</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] rounded-sm overflow-hidden">
          {QUOTES.map((q, i) => (
            <div
              key={i}
              className={`group p-8 bg-[#0a1828] hover:bg-[#0e2035] transition-all flex flex-col gap-3 relative ${
                q.faded ? 'opacity-60 hover:opacity-100' : ''
              }`}
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,#c8a840,transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="font-serif text-4xl leading-none text-[#7a6420] -mb-1">&ldquo;</div>
              <p className="text-[#dce6f4] text-sm font-light italic leading-relaxed flex-1">{q.text}</p>
              <div className="font-mono-sr text-[0.6rem] tracking-[0.18em] uppercase text-[#4a5c72]">{q.attr}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
