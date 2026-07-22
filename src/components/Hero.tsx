import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 px-5 py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,245,240,0.06),transparent_55%)]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto flex max-w-6xl flex-col items-center text-center"
      >
        <motion.img
          src={`${import.meta.env.BASE_URL}logo/logo.png`}
          alt="1upthrift logo"
          className="mb-8 h-28 w-28 object-contain md:h-36 md:w-36"
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        />

        <h1 className="font-display text-4xl font-medium tracking-tight text-paper md:text-6xl">
          1upthrift
        </h1>
        <p className="mt-3 max-w-md text-sm uppercase tracking-[0.28em] text-muted md:text-base">
          Vintage finds from Jordan
        </p>
        <motion.div
          className="mt-10 h-px w-24 bg-paper/30"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </motion.div>
    </section>
  )
}
