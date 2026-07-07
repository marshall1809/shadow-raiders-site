'use client'
import { useState } from 'react'
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

export default function App() {
  const [current, setCurrent] = useState<Page>('home')

  function navigate(page: string) {
    setCurrent(page as Page)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav current={current} onNavigate={navigate} />
      <div className="flex-1 pt-[62px]">
        {current === 'home'       && <HomePage       onNavigate={navigate} />}
        {current === 'alliance'   && <AlliancePage   />}
        {current === 'academy'    && <AcademyPage    />}
        {current === 'join'       && <JoinPage       />}
        {current === 'leadership' && <LeadershipPage onNavigate={navigate} />}
        {current === 'history'    && <HistoryPage    onNavigate={navigate} />}
        {current === 'schedule'   && <SchedulePage   />}
        {current === 'results'    && <ResultsPage    />}
        {current === 'faq'        && <FaqPage        />}
      </div>
      <Footer onNavigate={navigate} />
    </div>
  )
}
