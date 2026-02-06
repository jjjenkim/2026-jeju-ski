import { motion } from 'framer-motion'

const OFFICIAL_LINKS = [
      {
            name: "Korea Ski Association",
            url: "http://www.ski.or.kr",
            desc: "Official Federation"
      },
      {
            name: "FIS SKI",
            url: "https://www.fis-ski.com",
            desc: "Intl. Ski Federation"
      },
      {
            name: "대한체육회",
            url: "https://www.sports.or.kr",
            desc: "Korea Olympic Committee"
      },
      {
            name: "Milano 2026",
            url: "https://milanocortina2026.olympics.com",
            desc: "Winter Olympics"
      },
      {
            name: "Team Korea Instagram",
            url: "https://instagram.com/teamkorea_official",
            desc: "Social Updates"
      },
      {
            name: "Naver Sports",
            url: "https://sports.news.naver.com/wfootball/index",
            desc: "News & Highlights"
      }
]

export default function Footer() {
      return (
            <footer className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-32 pb-40">
                  <div className="flex flex-col gap-4 mb-8">
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">Official Resources</div>
                        <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter leading-none uppercase font-display text-white/40">
                              LINK <span className="text-stroke-3d">HUB</span>
                        </h2>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        {OFFICIAL_LINKS.map((link, i) => (
                              <motion.a
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    className="group glass-3d p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer border-transparent hover:border-primary/30 transition-all bg-white/2"
                              >
                                    <h3 className="text-[10px] md:text-xs font-black italic uppercase tracking-tight group-hover:text-primary transition-colors">{link.name}</h3>
                                    <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest leading-tight">{link.desc}</div>
                              </motion.a>
                        ))}
                  </div>

                  <div className="text-center mt-12 text-[10px] font-mono text-white/10 uppercase tracking-widest">
                        © 2026 Team Korea Winter. All Rights Reserved.
                  </div>
            </footer>
      )
}
