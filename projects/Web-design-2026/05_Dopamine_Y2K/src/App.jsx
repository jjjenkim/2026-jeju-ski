import GlitchText from './components/GlitchText'
import MarqueeBar from './components/MarqueeBar'
import CyberButton from './components/CyberButton'
import './styles/dopamine.css'

function App() {
      return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

                  {/* Top Banner */}
                  <MarqueeBar
                        text="WARNING: HIGH DOPAMINE LEVELS DETECTED // SYSTEM OVERLOAD // 2026 DESIGN TRENDS"
                        speed="15s"
                  />

                  {/* Main Content */}
                  <main style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '2rem',
                        border: '20px solid var(--c-chrome)',
                        margin: '2rem',
                        background: 'rgba(0,0,0,0.5)',
                        position: 'relative'
                  }}>

                        {/* Decorative Grid Background for container */}
                        <div style={{
                              position: 'absolute',
                              top: 0, left: 0, right: 0, bottom: 0,
                              backgroundImage: 'linear-gradient(var(--c-chrome) 1px, transparent 1px), linear-gradient(90deg, var(--c-chrome) 1px, transparent 1px)',
                              backgroundSize: '40px 40px',
                              opacity: 0.1,
                              zIndex: -1
                        }} />

                        <div style={{ marginBottom: '2rem' }}>
                              <span style={{
                                    background: 'var(--c-hot-pink)',
                                    color: 'white',
                                    padding: '0.2rem 1rem',
                                    fontFamily: 'var(--font-pixel)',
                                    fontSize: '1.5rem'
                              }}>
                                    ERROR_404: BORING_DESIGN_NOT_FOUND
                              </span>
                        </div>

                        <GlitchText text="DOPAMINE" as="h1" className="text-huge" />
                        <GlitchText text="OVERLOAD" as="h1" className="text-huge" />

                        <style>{`
          .text-huge {
            font-size: clamp(4rem, 15vw, 10rem);
            line-height: 0.8;
            color: var(--c-chrome);
            margin: 0;
            text-shadow: 4px 4px 0px var(--c-hot-pink);
          }
        `}</style>

                        <p style={{
                              maxWidth: '600px',
                              margin: '2rem auto',
                              fontFamily: 'var(--font-mono)',
                              lineHeight: '1.6',
                              border: '1px dashed var(--c-electric-blue)',
                              padding: '2rem'
                        }}>
                              Simplicity is dead. Long live chaos.
                              <br />
                              Welcome to the new internet. It's loud, it's messy, and it's
                              <span style={{ color: 'var(--c-acid-green)', fontWeight: 'bold' }}> alive</span>.
                        </p>

                        <div>
                              <CyberButton>Jack In</CyberButton>
                              <CyberButton>Abort</CyberButton>
                        </div>

                  </main>

                  {/* Footer Banner */}
                  <MarqueeBar
                        text="NOSTALGIA // CYBERNETIC // MAXIMALISM // BRUTALISM // Y2K //"
                        direction="right"
                        bg="var(--c-electric-blue)"
                        color="black"
                  />
            </div>
      )
}

export default App
