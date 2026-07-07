'use client'
import { useState } from 'react'

type NavItem = {
  id: string
  label: string
  href?: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home',       label: 'Home' },
  { id: 'alliance',   label: 'Alliance' },
  { id: 'academy',    label: 'Academy' },
  { id: 'join',       label: 'Join' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'history',    label: 'History' },
  { id: 'schedule',   label: 'Schedule' },
  { id: 'results',    label: 'Results' },
  { id: 'faq',        label: 'FAQ' },
  { id: 'members-link', label: 'Members Area', href: '/members' },
]

const DISCORD_LINKS = [
  {
    label: 'Shadow Raiders Elite',
    note: 'For experienced players only',
    href: 'https://discord.gg/cW8CefYnYt',
    tone: 'gold',
  },
  {
    label: 'Raiders Assembly',
    note: 'For all skill types, no requirements',
    href: 'https://discord.gg/e7c3DDaJmp',
    tone: 'blue',
  },
]

interface NavProps {
  current: string
  onNavigate: (page: string) => void
}

export default function Nav({ current, onNavigate }: NavProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const go = (page: string) => {
    onNavigate(page)
    setDrawerOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-[#04090f]/97 backdrop-blur-lg border-b border-[rgba(200,168,64,0.14)]">
      <div className="max-w-[1180px] mx-auto px-4 md:px-8">
        {/* Brand / logo row */}
        <div className="min-h-[56px] flex items-center justify-center border-b border-[rgba(255,255,255,0.06)]">
          <button onClick={() => go('home')} className="flex items-center gap-3 cursor-pointer py-3 bg-transparent border-none">
            <div className="w-[36px] h-[36px] rounded-full border border-[#7a6420] flex items-center justify-center text-[#c8a840] text-sm bg-[rgba(200,168,64,0.06)] shadow-[0_0_18px_rgba(200,168,64,0.12)] flex-shrink-0">
              ⚔
            </div>
            <div className="text-left">
              <div className="font-display text-[#c8a840] text-2xl leading-none">Shadow Raiders</div>
              <div className="font-mono-sr text-[#4a5c72] text-[0.58rem] tracking-widest mt-0.5">Supremacy WW3 Alliance</div>
            </div>
          </button>
        </div>

        {/* Discord entry buttons */}
        <div className="py-3 border-b border-[rgba(255,255,255,0.06)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-[760px] mx-auto">
            {DISCORD_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center justify-between gap-4 px-4 py-2.5 rounded-sm border transition-all hover:-translate-y-px ${
                  link.tone === 'gold'
                    ? 'border-[#7a6420] bg-[rgba(200,168,64,0.06)] hover:bg-[rgba(200,168,64,0.12)] hover:shadow-[0_4px_20px_rgba(200,168,64,0.18)]'
                    : 'border-[#2e4f6a] bg-[rgba(90,130,168,0.06)] hover:bg-[rgba(90,130,168,0.12)] hover:shadow-[0_4px_20px_rgba(90,130,168,0.16)]'
                }`}
              >
                <span className="min-w-0">
                  <span className={`block text-[0.72rem] sm:text-[0.76rem] font-semibold tracking-widest uppercase ${link.tone === 'gold' ? 'text-[#c8a840]' : 'text-[#7ca0c2]'}`}>
                    {link.label}
                  </span>
                  <span className="block text-[#8090a8] text-[0.68rem] font-light mt-0.5 leading-snug">
                    {link.note}
                  </span>
                </span>
                <span className={`text-sm transition-transform group-hover:translate-x-1 ${link.tone === 'gold' ? 'text-[#c8a840]' : 'text-[#7ca0c2]'}`} aria-hidden="true">
                  →
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Navigation row */}
        <nav className="min-h-[44px] flex items-center justify-center" aria-label="Main navigation">
          <ul className="hidden xl:flex gap-0 list-none items-center justify-center">
            {NAV_ITEMS.map(item => (
              <li key={item.id}>
                {item.href ? (
                  <a
                    href={item.href}
                    className="h-[44px] px-3 text-[0.68rem] font-medium tracking-widest uppercase border-b-2 border-transparent transition-all cursor-pointer flex items-center text-[#4a5c72] hover:text-[#c8a840]"
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    onClick={() => go(item.id)}
                    className={`h-[44px] px-3 text-[0.68rem] font-medium tracking-widest uppercase border-b-2 transition-all cursor-pointer bg-transparent ${
                      current === item.id ? 'text-[#c8a840] border-[#c8a840]' : 'text-[#4a5c72] border-transparent hover:text-[#8090a8]'
                    }`}
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>

          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="xl:hidden w-full min-h-[44px] flex items-center justify-center gap-3 cursor-pointer bg-transparent border-none text-[#8090a8] hover:text-[#c8a840] transition-colors"
            aria-label="Menu"
            aria-expanded={drawerOpen}
          >
            <span className="font-mono-sr text-[0.64rem] tracking-[0.24em] uppercase">Site Menu</span>
            <span className="flex flex-col gap-[5px]" aria-hidden="true">
              <span className={`block w-[22px] h-[1.5px] bg-current transition-all ${drawerOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
              <span className={`block w-[22px] h-[1.5px] bg-current transition-all ${drawerOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-[22px] h-[1.5px] bg-current transition-all ${drawerOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
            </span>
          </button>
        </nav>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="xl:hidden bg-[rgba(4,9,15,0.98)] border-t border-[rgba(255,255,255,0.06)]">
          <div className="max-w-[1180px] mx-auto px-6 py-4 flex flex-col gap-0">
            {NAV_ITEMS.map(item => (
              item.href ? (
                <a
                  key={item.id}
                  href={item.href}
                  className="text-left py-3.5 px-0 text-sm font-medium tracking-widest uppercase border-b border-[rgba(255,255,255,0.06)] text-[#8090a8] hover:text-[#c8a840] transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  className={`text-left py-3.5 px-0 text-sm font-medium tracking-widest uppercase border-b border-[rgba(255,255,255,0.06)] transition-colors cursor-pointer bg-transparent ${current === item.id ? 'text-[#c8a840]' : 'text-[#8090a8]'}`}
                >
                  {item.label}
                </button>
              )
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
