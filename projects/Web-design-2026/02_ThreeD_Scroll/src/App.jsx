import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import './styles/immersive.css'

function App() {
      const targetRef = useRef(null)
      const { scrollYProgress } = useScroll({
            target: targetRef,
            offset: ["start start", "end end"]
      })

      const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
      const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
      const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

      return (
            <div ref={targetRef} style={{ height: "300vh" }}>
                  <div className="stage" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                        {/* Background Elements */}
                        <motion.div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
                              <div style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', background: 'var(--neon-purple)', filter: 'blur(150px)', opacity: 0.3 }}></div>
                              <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: '400px', height: '400px', background: 'var(--neon-cyan)', filter: 'blur(150px)', opacity: 0.2 }}></div>
                        </motion.div>

                        {/* Hero Section */}
                        <motion.div style={{ opacity, scale, y, textAlign: 'center', zIndex: 10 }} className="hero-content">
                              <p className="neon-text" style={{ fontSize: '1.2rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>2026 Web Trends</p>
                              <h1>Cinematic<br />Immersion</h1>
                              <p style={{ marginTop: '2rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '2rem auto' }}>
                                    Scroll to experience depth. A story told through motion and perspective.
                              </p>
                        </motion.div>

                  </div>

                  {/* Scroll Triggered Content */}
                  <div style={{ position: 'relative', top: '100vh', padding: '100px 20px', maxWidth: '1200px', margin: '0 auto', zIndex: 20 }}>
                        <div className="glass-panel" style={{ marginBottom: '200px', transform: 'rotate(-2deg)' }}>
                              <h2 style={{ fontSize: '3rem' }}>Depth without Weight</h2>
                              <p style={{ fontSize: '1.5rem', marginTop: '20px', color: '#ccc' }}>
                                    Using CSS transforms + Framer Motion for high-performance 60fps animations.
                              </p>
                        </div>

                        <div className="glass-panel" style={{ marginLeft: 'auto', maxWidth: '600px', transform: 'rotate(2deg)', border: '1px solid var(--neon-lime)' }}>
                              <h2 style={{ fontSize: '3rem', color: 'var(--neon-lime)' }}>Neon & Noise</h2>
                              <p style={{ fontSize: '1.5rem', marginTop: '20px', color: '#ccc' }}>
                                    Dark interfaces pop with calculated neon accents and subtle grain textures.
                              </p>
                        </div>
                  </div>
            </div>
      )
}

export default App
