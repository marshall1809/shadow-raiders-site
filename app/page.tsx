'use client'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import HomePage from '@/components/pages/HomePage'
import AlliancePage from '@/components/pages/AlliancePage'
import AcademyPage from '@/components/pages/AcademyPage'
import JoinPage from '@/components/pages/JoinPage'
import LeadershipPage from '@/components/pages/LeadershipPage'
import HistoryPage from '@/components/pages/HistoryPage'
import SchedulePage from '@/components/pages/SchedulePage'
import ResultsPage from '@/components/pages/ResultsPage'
import FaqPage from '@/components/pages/FaqPage'

type Page = 'home' | 'alliance' | 'academy' | 'join' | 'leadership' | 'history' | 'schedule' | 'results' | 'faq'

type HomeDiscordLink = {
  label: string
  note: string
  href: string
  tone: 'gold' | 'blue'
}

const HOME_DISCORD_LINKS: HomeDiscordLink[] = [
  {
    label: 'Shadow Raiders Elite Discord',
    note: 'Rank 35+ · 1.5+ K/D · Experienced players only',
    href: 'https://discord.gg/cW8CefYnYt',
    tone: 'gold',
  },
  {
    label: 'Raiders Assembly Discord',
    note: 'All skill levels welcome · No requirements',
    href: 'https://discord.gg/e7c3DDaJmp',
    tone: 'blue',
  },
]

function HomeEntryHeader() {
  return (
    <section className="bg-[#04090f] border-b border-[rgba(200,168,64,0.14)]">
      <div className="max-w-[1180px] mx-auto px-4 md:px-8 py-4 md:py-5">
        <div className="flex items-center justify-center gap-3">
          <div className="w-[42px] h-[42px] rounded-full border border-[#7a6420] flex items-center justify-center text-[#c8a840] text-base bg-[rgba(200,168,64,0.06)] shadow-[0_0_22px_rgba(200,168,64,0.14)] flex-shrink-0">
            ⚔
          </div>
          <div className="text-left">
            <div className="font-display text-[#c8a840] text-3xl leading-none">Shadow Raiders</div>
            <div className="font-mono-sr text-[#4a5c72] text-[0.62rem] tracking-widest mt-0.5 uppercase">Supremacy WW3 Alliance</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HomeHeroDiscordCards() {
  const [target, setTarget] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const heroTitle = document.querySelector('section h1')
    if (!heroTitle) return

    let slot = document.getElementById('home-hero-discord-slot')
    if (!slot) {
      slot = document.createElement('div')
      slot.id = 'home-hero-discord-slot'
      slot.className = 'mt-6 mb-6 w-full max-w-[760px] mx-auto'
      heroTitle.insertAdjacentElement('afterend', slot)
    }

    setTarget(slot)

    return () => {
      slot?.remove()
      setTarget(null)
    }
  }, [])

  if (!target) return null

  return createPortal(
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {HOME_DISCORD_LINKS.map(link => (
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
          <span className="min-w-0 text-left">
            <span className={`block text-[0.7rem] sm:text-[0.74rem] font-semibold tracking-widest uppercase ${link.tone === 'gold' ? 'text-[#c8a840]' : 'text-[#7ca0c2]'}`}>
              {link.label}
            </span>
            <span className="block text-[#8090a8] text-[0.66rem] font-light mt-0.5 leading-snug">
              {link.note}
            </span>
          </span>
          <span className={`text-sm transition-transform group-hover:translate-x-1 ${link.tone === 'gold' ? 'text-[#c8a840]' : 'text-[#7ca0c2]'}`} aria-hidden="true">
            →
          </span>
        </a>
      ))}
    </div>,
    target,
  )
}

export default function App() {
  const [current, setCurrent] = useState<Page>('home')

  function navigate(page: string) {
    setCurrent(page as Page)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {current === 'home' && <HomeEntryHeader />}
      <Nav current={current} onNavigate={navigate} showBrand={current !== 'home'} />
      <div className="flex-1">
        {current === 'home'       && <HomePage       onNavigate={navigate} />}
        {current === 'home'       && <HomeHeroDiscordCards />}
        {current === 'alliance'   && <AlliancePage   />}
        {current === 'academy'    && <AcademyPage    />}
        {current === 'join'       && <JoinPage       />}
        {current === 'leadership' && <LeadershipPage onNavigate={navigate} />}
        {current === 'history'    && <HistoryPage    />}
        {current === 'schedule'   && <SchedulePage   />}
        {current === 'results'    && <ResultsPage    />}
        {current === 'faq'        && <FaqPage        />}
      </div>
      <Footer onNavigate={navigate} />
    </div>
  )
}
