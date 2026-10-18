import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import SmoothScroll from './components/SmoothScroll'
import { ScrollProgress, Navbar, SectionRail, type RailItem } from './components/Chrome'
import { Hero, Ticker, Categories, Products } from './sections/HomeTop'
import { NewArrivals, PopularCollection } from './sections/HomeMarket'
import {
  Making,
  ComingSoon,
  Qualities,
  Lookbook,
  StatsTestimonials,
  FAQ,
  ContactStrip,
  Footer,
} from './sections/HomeBottom'
import About from './pages/About'
import Contact from './pages/Contact'

const railItems: RailItem[] = [
  { id: 'hero', label: 'Top' },
  { id: 'categories', label: 'Collections' },
  { id: 'products', label: 'Pieces' },
  { id: 'arrivals', label: 'New Arrivals' },
  { id: 'popular', label: 'Popular' },
  { id: 'making', label: 'The Making' },
  { id: 'soon', label: 'E-shop' },
  { id: 'qualities', label: 'Why DK' },
  { id: 'lookbook', label: 'Lookbook' },
  { id: 'voices', label: 'Voices' },
  { id: 'faq', label: 'FAQ' },
  { id: 'visit', label: 'Visit' },
]

function Home() {
  return (
    <main>
      <Hero />
      <Categories />
      <Ticker />
      <Products />
      <NewArrivals />
      <PopularCollection />
      <Making />
      <ComingSoon />
      <Qualities />
      <Lookbook />
      <StatsTestimonials />
      <FAQ />
      <ContactStrip />
      <SectionRail items={railItems} />
    </main>
  )
}

function PageChrome() {
  const location = useLocation()
  return (
    <>
      <AnnouncementWrapper />
      <Navbar />
      <ScrollProgress />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  )
}

function AnnouncementWrapper() {
  return (
    <div
      id="announce-bar"
      className="bg-moss px-4 py-2 text-center text-[11px] font-medium uppercase tracking-[0.25em] text-ivory"
    >
      E-commerce launching soon — join the notify list
    </div>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)

  /* skip preloader for repeated visits in the same tab session */
  useEffect(() => {
    if (sessionStorage.getItem('dk-seen')) setLoading(false)
    else sessionStorage.setItem('dk-seen', '1')
  }, [])

  return (
    <div className="paper-grain relative min-h-screen">
      {loading && <Preloader onDone={() => setLoading(false)} />}
      <Cursor />
      <SmoothScroll>
        <PageChrome />
      </SmoothScroll>
    </div>
  )
}
