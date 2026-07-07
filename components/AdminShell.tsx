'use client'
import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

const ADMIN_ITEMS = [
  { label: 'Schedule', href: '/admin/schedule' },
  { label: 'Results', href: '/admin/results' },
  { label: 'Leadership', href: '/admin/leadership' },
  { label: 'Hall of Fame', href: '/admin/hall-of-fame' },
  { label: 'FAQ', href: '/admin/faq' },
  { label: 'Members', href: '/admin/members' },
]

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/admin') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#04090f]">
      <header className="sticky top-0 z-50 bg-[#07111e] border-b border-[rgba(255,255,255,0.06)]">
        <div className="max-w-[1180px] mx-auto px-4 md:px-8 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[#7a6420] flex items-center justify-center text-[#c8a840] bg-[rgba(200,168,64,0.06)] flex-shrink-0">
              ⚔
            </div>
            <div>
              <div className="font-display text-[#c8a840] text-2xl leading-none">Shadow Raiders</div>
              <div className="font-mono-sr text-[#4a5c72] text-[0.58rem] tracking-widest uppercase">Admin Panel</div>
            </div>
          </div>

          <nav aria-label="Admin navigation" className="flex flex-wrap gap-2">
            {ADMIN_ITEMS.map(item => {
              const active = pathname === item.href
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-sm border text-[0.64rem] font-semibold tracking-widest uppercase transition-colors ${
                    active
                      ? 'border-[#c8a840] text-[#c8a840] bg-[rgba(200,168,64,0.08)]'
                      : 'border-[rgba(255,255,255,0.06)] text-[#8090a8] hover:text-[#c8a840] hover:border-[#7a6420]'
                  }`}
                >
                  {item.label}
                </a>
              )
            })}
            <a
              href="/"
              className="px-3 py-2 rounded-sm border border-[rgba(255,255,255,0.06)] text-[#4a5c72] hover:text-[#8090a8] text-[0.64rem] font-semibold tracking-widest uppercase transition-colors"
            >
              Site
            </a>
            <form action="/api/auth" method="post" className="inline-flex">
              <input type="hidden" name="_method" value="DELETE" />
              <button
                type="submit"
                className="px-3 py-2 rounded-sm border border-[rgba(255,255,255,0.06)] text-[#4a5c72] hover:text-red-400 hover:border-red-900 text-[0.64rem] font-semibold tracking-widest uppercase transition-colors bg-transparent cursor-pointer"
              >
                Sign Out
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="max-w-[1180px] mx-auto px-4 md:px-8 py-10">
        {children}
      </main>
    </div>
  )
}
