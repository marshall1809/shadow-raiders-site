'use client'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import HallOfFamePage from '@/components/pages/HallOfFamePage'

function navigate(page: string) {
  if (page === 'home') {
    window.location.href = '/'
    return
  }
  window.location.href = `/?page=${page}`
}

export default function HallOfFameRoute() {
  return (
    <div className="min-h-screen flex flex-col bg-[#04090f]">
      <Nav current="hall-of-fame" onNavigate={navigate} />
      <div className="flex-1">
        <HallOfFamePage />
      </div>
      <Footer onNavigate={navigate} />
    </div>
  )
}
