import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { scrollToId } from './SmoothScroll'

/* ---------- top scroll progress bar ---------- */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })
  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-caramel"
      style={{ scaleX }}
    />
  )
}

/* ---------- floating section-dot guide rail ---------- */
export type RailItem = { id: string; label: string }

export function SectionRail({ items }: { items: RailItem[] }) {
  const [active, setActive] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    items.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [items])

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.5)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      aria-label="Section guide"
      className="fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 20 }}
      transition={{ duration: 0.4 }}
    >
      {items.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => scrollToId(id)}
          className="group flex items-center gap-2"
          aria-label={`Go to ${label}`}
        >
          <span
            className={`whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium transition-all duration-300 ${
              active === id
                ? 'bg-moss text-ivory opacity-100'
                : 'bg-ivory/90 text-olive opacity-0 shadow-soft group-hover:opacity-100'
            }`}
          >
            {label}
          </span>
          <span
            className={`block rounded-full transition-all duration-300 ${
              active === id ? 'h-4 w-2 bg-caramel' : 'h-2 w-2 bg-olive/40'
            }`}
          />
        </button>
      ))}
    </motion.nav>
  )
}

/* ---------- navbar ---------- */

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [minimized, setMinimized] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setMinimized(y > 80)
      /* clear the announcement strip while it is still in view */
      setAtTop(y < 40)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  return (
    <motion.header
      className="fixed inset-x-0 z-[55] px-4"
      initial={{ top: 46 }}
      animate={{ top: atTop ? 46 : 8 }}
      transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <motion.div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full border border-hairline px-5 py-3 transition-all duration-500 ${
          minimized ? 'bg-ivory/85 backdrop-blur-md shadow-soft' : 'bg-transparent'
        }`}
        animate={{ paddingTop: minimized ? 10 : 12, paddingBottom: minimized ? 10 : 12 }}
      >
        <Link
          to="/"
          className="flex items-center transition-transform duration-300 hover:scale-[1.04]"
          aria-label="DK Fashion — home"
        >
          {/* generous height + negative margins: the logo's white padding is
          blended away (multiply), so the mark reads large inside a slim pill */}
          <img
            src="/dk.png"
            alt="DK Fashion"
            className="h-20 w-auto -my-10 mix-blend-multiply sm:h-22 sm:-my-12"
            draggable={false}
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `group relative rounded-full px-4 py-2 text-sm transition-colors ${
                  isActive ? 'text-moss' : 'text-olive hover:text-moss'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-sage"
                      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <motion.span
            className="h-[2px] w-5 bg-moss"
            animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
          />
          <motion.span
            className="h-[2px] w-5 bg-moss"
            animate={open ? { opacity: 0 } : { opacity: 1 }}
          />
          <motion.span
            className="h-[2px] w-5 bg-moss"
            animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
          />
        </button>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl border border-hairline bg-ivory/95 backdrop-blur-md md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <div className="flex flex-col p-3">
              {navLinks.map(({ to, label }, i) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i }}
                >
                  <NavLink
                    to={to}
                    className="block rounded-xl px-4 py-3 text-sm text-moss hover:bg-sage"
                  >
                    {label}
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.header>
  )
}

/* ---------- announcement bar ---------- */

export function AnnouncementBar() {
  return (
    <div className="relative z-[60] flex items-center justify-center gap-2 bg-moss px-4 py-2 text-center text-[11px] font-medium uppercase tracking-[0.25em] text-ivory">
      <motion.span
        className="inline-block h-1.5 w-1.5 rounded-full bg-caramel"
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ repeat: Infinity, duration: 1.6 }}
      />
      E-commerce launching soon — join the notify list
    </div>
  )
}
