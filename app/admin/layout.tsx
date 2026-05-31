import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const ADMIN_LINKS = [
  { href: '/admin/schedule',       label: 'Schedule' },
  { href: '/admin/results',        label: 'Results' },
  { href: '/admin/leadership',     label: 'Leadership' },
  { href: '/admin/faq',            label: 'FAQ' },
  { href: '/admin/members',        label: 'Members' },
  { href: '/admin/member-content', label: 'Member Content' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/admin-login')

  return (
    <div className="min-h-screen bg-[#04090f] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#07111e] border-r border-[rgba(255,255,255,0.06)] flex flex-col p-6 gap-1 fixed top-0 bottom-0">
        <div className="font-display text-[#c8a840] text-xl mb-1">Shadow Raiders</div>
        <div className="font-mono-sr text-[#4a5c72] text-[0.58rem] tracking-widest mb-8">Admin Panel</div>
        {ADMIN_LINKS.map(l => (
          <Link key={l.href} href={l.href}
            className="px-3 py-2.5 text-sm text-[#8090a8] hover:text-[#c8a840] hover:bg-[rgba(200,168,64,0.05)] rounded-sm transition-all font-medium tracking-wide">
            {l.label}
          </Link>
        ))}
        <div className="mt-auto flex flex-col gap-2">
          <Link href="/" className="px-3 py-2 text-xs text-[#4a5c72] hover:text-[#8090a8] transition-colors">← View Site</Link>
          <form action="/api/auth" method="POST">
            <input type="hidden" name="_method" value="DELETE" />
            <button type="submit" className="w-full text-left px-3 py-2 text-xs text-[#4a5c72] hover:text-red-400 transition-colors bg-transparent border-none cursor-pointer">
              Sign Out
            </button>
          </form>
        </div>
      </aside>
      {/* Main */}
      <main className="ml-56 flex-1 p-10">
        {children}
      </main>
    </div>
  )
}
