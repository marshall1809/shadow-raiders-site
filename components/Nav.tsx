'use client'
import { useState } from 'react'

const NAV_ITEMS = [
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
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-[62px] flex items-center justify-between px-4 md:px-8 bg-[#04090f]/97 backdrop-blur-lg border-b border-[rgba(200,168,64,0.14)]">
        {/* Brand */}
        <button onClick={() => go('home')} className="flex items-center gap-3 cursor-pointer">
          <div className="w-[30px] h-[30px] rounded-full border border-[#7a6420] flex items-center justify-center text-[#c8a840] text-xs bg-[rgba(200,168,64,0.06)] flex-shrink-0">
            ⚔
          </div>
          <div className="text-left">
            <div className="font-display text-[#c8a840] text-xl leading-none">Shadow Raiders</div>
            <div className="font-mono-sr text-[#4a5c72] text-[0.58rem] tracking-widest mt-0.5">Supremacy WW3 Alliance</div>
          </div>
        </button>

        {/* Desktop links */}
        <ul className="hidden xl:flex gap-0 list-none">
          {NAV_ITEMS.map(item => (
            <li key={item.id}>
              {(item as any).href ? (
                <a
                  href={(item as any).href}
                  className="h-[62px] px-4 text-[0.75rem] font-medium tracking-widest uppercase border-b-2 border-transparent transition-all cursor-pointer flex items-center text-[#4a5c72] hover:text-[#c8a840]"
                >
                  {item.label}
                </a>
              ) : (
                <button
                  onClick={() => go(item.id)}
                  className={`h-[62px] px-4 text-[0.75rem] font-medium tracking-widest uppercase border-b-2 transition-all cursor-pointer ${
                    current === item.id ? 'text-[#c8a840] border-[#c8a840]' : 'text-[#4a5c72] border-transparent hover:text-[#8090a8]'
                  }`}
                >
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href="https://discord.gg/cmuGSVXQFN"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden xl:inline-flex items-center px-5 py-2 border border-[#c8a840] text-[#c8a840] text-[0.72rem] font-semibold tracking-widest uppercase rounded-sm transition-all hover:bg-[#c8a840] hover:text-[#04090f] hover:shadow-[0_0_20px_rgba(200,168,64,0.3)]"
        >
          Join Now
        </a>

        {/* Hamburger */}
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="xl:hidden flex flex-col gap-[5px] p-1 cursor-pointer bg-transparent border-none"
          aria-label="Menu"
        >
          <span className={`block w-[22px] h-[1.5px] bg-[#8090a8] transition-all ${drawerOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
          <span className={`block w-[22px] h-[1.5px] bg-[#8090a8] transition-all ${drawerOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-[22px] h-[1.5px] bg-[#8090a8] transition-all ${drawerOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
        </button>
      </nav>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed top-[62px] left-0 right-0 bottom-0 z-40 bg-[rgba(4,9,15,0.98)] flex flex-col border-t border-[rgba(255,255,255,0.06)] overflow-y-auto">
          <div className="flex flex-col p-6 gap-0">
          {NAV_ITEMS.map(item => (
            (item as any).href ? (
              <a key={item.id} href={(item as any).href}
                className="text-left py-4 px-0 text-base font-medium tracking-widest uppercase border-b border-[rgba(255,255,255,0.06)] text-[#8090a8] hover:text-[#c8a840] transition-colors">
                {item.label}
              </a>
            ) : (
              <button key={item.id} onClick={() => go(item.id)}
                className={`text-left py-4 px-0 text-base font-medium tracking-widest uppercase border-b border-[rgba(255,255,255,0.06)] transition-colors cursor-pointer bg-transparent ${current === item.id ? 'text-[#c8a840]' : 'text-[#8090a8]'}`}>
                {item.label}
              </button>
            )
          ))}
            <a
              href="https://discord.gg/cmuGSVXQFN"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 text-center py-3 px-6 border border-[#c8a840] text-[#c8a840] text-sm font-semibold tracking-widest uppercase rounded-sm"
            >
              Join Shadow Raiders
            </a>
          </div>
        </div>
      )}
    </>
  )
}
