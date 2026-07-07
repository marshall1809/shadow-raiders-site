'use client'

interface FooterProps {
  onNavigate: (page: string) => void
}

const FOOTER_PAGES = ['alliance','academy','join','leadership','history','schedule','results','faq']

export default function Footer({ onNavigate }: FooterProps) {
  const go = (page: string) => {
    onNavigate(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#07111e] border-t border-[rgba(255,255,255,0.06)] pt-14 pb-8">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 mb-8 border-b border-[rgba(255,255,255,0.06)]">
          <div className="md:col-span-2">
            <div className="font-display text-[#c8a840] text-2xl mb-2">Shadow Raiders Alliance</div>
            <p className="text-[#8090a8] text-sm font-light leading-relaxed max-w-xs">
              An elite gaming alliance in Supremacy WW3. Built on discipline, execution, and loyalty since 2023.
            </p>
          </div>
          <div>
            <div className="text-[#4a5c72] text-[0.65rem] font-semibold tracking-[0.22em] uppercase mb-4">Pages</div>
            <ul className="flex flex-col gap-2">
              {FOOTER_PAGES.map(p => (
                <li key={p}>
                  <button onClick={() => go(p)} className="text-[#8090a8] text-sm font-light hover:text-[#c8a840] transition-colors capitalize cursor-pointer bg-transparent border-none p-0">
                    {p === 'faq' ? 'FAQ' : p === 'join' ? 'Join' : p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                </li>
              ))}
              <li>
                <a href="/hall-of-fame" className="text-[#8090a8] text-sm font-light hover:text-[#c8a840] transition-colors">
                  Hall of Fame
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-[#4a5c72] text-[0.65rem] font-semibold tracking-[0.22em] uppercase mb-4">Join</div>
            <div className="flex flex-col gap-2 mb-6">
              <button onClick={() => go('join')} className="text-left text-[#8090a8] text-sm font-light hover:text-[#c8a840] transition-colors cursor-pointer bg-transparent border-none p-0">Recruitment Path</button>
              <a href="https://discord.gg/cW8CefYnYt" target="_blank" rel="noopener noreferrer" className="text-[#8090a8] text-sm font-light hover:text-[#c8a840] transition-colors">Elite Discord</a>
              <a href="https://discord.gg/e7c3DDaJmp" target="_blank" rel="noopener noreferrer" className="text-[#8090a8] text-sm font-light hover:text-[#c8a840] transition-colors">Raiders Assembly</a>
            </div>
            <div className="text-[#4a5c72] text-[0.65rem] font-semibold tracking-[0.22em] uppercase mb-3">Contact</div>
            <div className="font-mono-sr text-[#c8a840] text-sm mb-1">Marc1809</div>
            <div className="text-[#8090a8] text-xs font-light">Discord — DM for questions</div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="font-mono-sr text-[#4a5c72] text-[0.6rem] tracking-widest">
            © 2026 Shadow Raiders Alliance · Supremacy WW3 · All rights reserved
          </div>
          <div className="text-[rgba(200,168,64,0.3)] text-sm italic">"Tacite et celeriter — Quietly and swiftly."</div>
        </div>
      </div>
    </footer>
  )
}
