import { useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { CurtainImage, SectionHeading, Counter, StaggerGroup, StepItem } from '../components/motion-kit'
import { Reveal } from '../components/motion-kit'

const easeSoft: [number, number, number, number] = [0.22, 0.61, 0.36, 1]

/* ================= NEW ARRIVALS =================
   Three columns that drift at different scroll speeds (isotope feel);
   tiles enter in staggered steps with curtained image reveals.        */

const arrivalColumns = [
  [
    { name: 'Drift Wide-Leg Cargo — Rose', price: 'RM 95', tag: 'New', src: '/products/product-04.jpg' },
    { name: 'Velocity Tee — Chalk', price: 'RM 49', tag: 'New', src: '/products/product-13.jpg' },
  ],
  [
    { name: 'Drift Wide-Leg Cargo — Ash', price: 'RM 95', tag: 'New', src: '/products/product-06.jpg' },
    { name: 'Baggy Denim — Mauve', price: 'RM 119', tag: 'New', src: '/products/product-20.jpg' },
    { name: 'Override Tee — White', price: 'RM 49', tag: 'New', src: '/products/product-14.jpg' },
  ],
  [
    { name: 'Shadow Tee — White', price: 'RM 49', tag: 'New', src: '/products/product-15.jpg' },
    { name: 'Discover Tee — White', price: 'RM 49', tag: 'New', src: '/products/product-19.jpg' },
  ],
]

function ArrivalTile({
  item,
  delay,
}: {
  item: (typeof arrivalColumns)[number][number]
  delay: number
}) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-[1.6rem] img-fallback shadow-soft transition-shadow duration-500 hover:shadow-lift"
      initial={{ opacity: 0, y: 46, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ delay, duration: 0.6, ease: easeSoft }}
    >
      <CurtainImage
        src={item.src}
        alt={item.name}
        className="h-56 w-full sm:h-64"
        imgClassName="transition-transform duration-700 group-hover:scale-105"
        delay={delay}
      />
      {/* pulse tag */}
      <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-ivory/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-caramel-deep shadow-soft">
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-caramel"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        />
        {item.tag}
      </span>
      {/* bottom info bar */}
      <div className="absolute inset-x-3 bottom-3 translate-y-14 rounded-xl bg-ivory/90 px-4 py-2.5 backdrop-blur-md transition-transform duration-500 group-hover:translate-y-0">
        <p className="font-display text-sm">{item.name}</p>
        <p className="text-[11px] font-semibold text-caramel-deep">{item.price}</p>
      </div>
    </motion.div>
  )
}

export function NewArrivals() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], [40, -36])
  const y2 = useTransform(scrollYProgress, [0, 1], [90, -70])
  const y3 = useTransform(scrollYProgress, [0, 1], [58, -44])

  const colY = [y1, y2, y3]

  return (
    <section ref={ref} id="arrivals" className="py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="Fresh off the table"
          title="New arrivals, this fortnight"
          accentWords={['fortnight']}
          className="mb-14"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {arrivalColumns.map((col, c) => (
            <motion.div key={c} style={{ y: colY[c] }} className={`flex flex-col gap-6 sm:gap-8 lg:gap-10 ${c === 1 ? 'lg:mt-10' : ''}`}>
              {col.map((item, i) => (
                <ArrivalTile key={item.name} item={item} delay={c * 0.1 + i * 0.12} />
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ================= POPULAR COLLECTION =================
   Ranked grid; each card carries a scroll-scrubbed wear-meter and
   cursor tilt so it stays alive under the hand.                       */

const popular = [
  { rank: '01', name: 'Palazzo Knit — Cream', wears: 2140, src: '/products/product-01.jpg' },
  { rank: '02', name: 'Bushido Samurai Tee', wears: 1870, src: '/products/product-09.jpg' },
  { rank: '03', name: 'Drift Wide-Leg Cargo — Rose', wears: 1520, src: '/products/product-04.jpg' },
  { rank: '04', name: 'Baggy Denim — Indigo', wears: 1280, src: '/products/product-17.jpg' },
]

function PopularCard({ item, index }: { item: (typeof popular)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  /* wear-meter scrubs with scroll — fills as the card travels up */
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end 60%'] })

  /* cursor tilt */
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 140, damping: 14 })
  const sry = useSpring(ry, { stiffness: 140, damping: 14 })

  return (
    <motion.div
      ref={ref}
      className="group relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ delay: index * 0.09, duration: 0.6, ease: easeSoft }}
      style={{ perspective: 900 }}
      onPointerMove={(e) => {
        const el = ref.current
        if (!el || e.pointerType === 'touch') return
        const r = el.getBoundingClientRect()
        ry.set(((e.clientX - (r.left + r.width / 2)) / r.width) * 10)
        rx.set(((e.clientY - (r.top + r.height / 2)) / r.height) * -10)
      }}
      onPointerLeave={() => {
        rx.set(0)
        ry.set(0)
      }}
    >
      <motion.div
        className="relative overflow-hidden rounded-[1.6rem] img-fallback shadow-soft transition-shadow duration-500 group-hover:shadow-lift"
        style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
        whileHover={{ zIndex: 20 }}
      >
        <CurtainImage
          src={item.src}
          alt={item.name}
          className="h-64 w-full sm:h-72"
          imgClassName="transition-transform duration-700 group-hover:scale-105"
          delay={index * 0.07}
        />
        {/* rank numeral */}
        <motion.span
          className="text-outline absolute -left-1 -top-3 select-none font-display text-6xl font-semibold"
          style={{ transform: 'translateZ(40px)' }}
          initial={{ opacity: 0, x: -14 }}
          animate={undefined}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.09 + 0.25, duration: 0.5 }}
        >
          {item.rank}
        </motion.span>
        {/* wear chip */}
        <div className="absolute inset-x-3 bottom-3 translate-y-14 rounded-xl bg-ivory/90 px-4 py-2.5 backdrop-blur-md transition-transform duration-500 group-hover:translate-y-0">
          <p className="font-display text-sm">{item.name}</p>
          <p className="text-[11px] text-olive">
            <Counter to={item.wears} suffix="+" className="font-semibold text-caramel-deep" /> wears this season
          </p>
        </div>
      </motion.div>

      {/* scroll-scrubbed meter */}
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-hairline">
        <motion.div
          className="h-full origin-left bg-caramel"
          style={{ scaleX: scrollYProgress }}
        />
      </div>
    </motion.div>
  )
}

export function PopularCollection() {
  return (
    <section id="popular" className="bg-sand/60 py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <StaggerGroup className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <StepItem>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-eucalyptus-deep">
              Popular collection
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl">
              Most <em className="font-display italic text-caramel">worn</em> this season
            </h2>
          </StepItem>
          <StepItem className="max-w-sm text-sm leading-relaxed text-olive">
            Meters below each card fill as you scroll — the more people wore it,
            the higher it sits.
          </StepItem>
        </StaggerGroup>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {popular.map((p, i) => (
            <PopularCard key={p.name} item={p} index={i} />
          ))}
        </div>

        <Reveal className="mt-16 text-center">
          <p className="text-sm text-olive">
            Popularity is counted from repeat wear, not views — we ask in store, kindly.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
