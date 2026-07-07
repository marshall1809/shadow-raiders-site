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

interface NavProps {
  current: string
  onNavigate: (page: string) => void
  showBrand?: boolean
}

export default function Nav({ current, onNavigate, showBrand = true }: NavProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const go = (page: string) => {
    onNavigate(page)
    setDrawerOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-[#04090f]/97 backdrop-blur-lg border-b border-[rgba(200,168,64,0.14)]">
      <div className="max-w-[1180px] mx-auto px-4 md:px-8">
        <div className={`min-h-[62px] flex items-center gap-4 ${showBrand ? 'justify-between' : 'justify-center'}`}>
          {showBrand && (
            <button onClick={() => go('home')} className="flex items-center gap-3 cursor-pointer py-3 bg-transparent border-none flex-shrink-0">
              <div className="w-[36px] h-[36px] rounded-full border border-[#7a6420] flex items-center justify-center text-[#c8a840] text-sm bg-[rgba(200,168,64,0.06)] shadow-[0_0_18px_rgba(200,168,64,0.12)] flex-shrink-0">
                ⚔
              </div>
              <div className="text-left">
                <div className="font-display text-[#c8a840] text-2xl leading-none">Shadow Raiders</div>
                <div className="font-mono-sr text-[#4a5c72] text-[0.58rem] tracking-widest mt-0.5">Supremacy WW3 Alliance</div>
              </div>
            </button>
          )}

          <nav className={`${showBrand ? 'hidden xl:flex' : 'hidden md:flex'} items-center justify-center`} aria-label="Main navigation">
            <ul className="flex gap-0 list-none items-center justify-center flex-wrap">
              {NAV_ITEMS.map(item => (
                <li key={item.id}>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="h-[46px] px-3 text-[0.68rem] font-medium tracking-widest uppercase border-b-2 border-transparent transition-all cursor-pointer flex items-center text-[#4a5c72] hover:text-[#c8a840]"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <button
                      onClick={() => go(item.id)}
                      className={`h-[46px] px-3 text-[0.68rem] font-medium tracking-widest uppercase border-b-2 transition-all cursor-pointer bg-transparent ${
                        current === item.id ? 'text-[#c8a840] border-[#c8a840]' : 'text-[#4a5c72] border-transparent hover:text-[#8090a8]'
                      }`}
                    >
                      {item.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className={`${showBrand ? 'xl:hidden' : 'md:hidden'} min-h-[44px] flex items-center justify-center gap-3 cursor-pointer bg-transparent border-none text-[#8090a8] hover:text-[#c8a840] transition-colors`}
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
        </div>
      </div>

      {drawerOpen && (
        <div className={`${showBrand ? 'xl:hidden' : 'md:hidden'} bg-[rgba(4,9,15,0.98)] border-t border-[rgba(255,255,255,0.06)]`}>
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
