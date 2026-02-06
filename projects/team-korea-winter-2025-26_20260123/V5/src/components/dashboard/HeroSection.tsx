import { motion } from 'framer-motion'

export const HeroSection = () => {
  return (
    <section className="relative min-h-[60vh] flex flex-col items-center justify-center hero-urban-gradient overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-blue-900 rounded-full mix-blend-screen filter blur-[128px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-red-900 rounded-full mix-blend-screen filter blur-[128px] animate-pulse" />
      </div>

      {/* Main Content */}
      <div className="z-10 text-center px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6"
        >
          <span className="inline-block py-1 px-3 glass-urban rounded-full text-xs font-bold tracking-[0.2em] text-cyan-400 mb-4 border border-cyan-500/30">
            OFFICIAL DATA PARTNER
          </span>
          <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter text-metallic leading-none mb-2">
            TEAM KOREA
          </h1>
          <h2 className="text-2xl md:text-4xl font-light tracking-[1em] text-white opacity-90">
            WINTER 2026
          </h2>
        </motion.div>

        {/* Floating Stats Strips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-8 mt-12"
        >
          {['15 SPORTS', '86 EVENTS', '204 ATHLETES'].map((item) => (
            <motion.div
              key={item}
              whileHover={{ y: -5, scale: 1.05 }}
              className="glass-urban py-2 px-6 rounded-none border-l-2 border-cyan-500/50"
            >
              <span className="text-sm font-bold tracking-widest text-cyan-300">{item}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] pointer-events-none" />
    </section>
  )
}
