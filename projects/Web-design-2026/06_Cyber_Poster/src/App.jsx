import ChromeTitle from './components/ChromeTitle'
import TechGrid from './components/TechGrid'
import './styles/cyber.css'

function App() {
      return (
            <div className="cyber-poster">
                  <div className="noise-overlay"></div>
                  <TechGrid />

                  <div style={{
                        position: 'relative',
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '2rem'
                  }}>

                        {/* Top Label */}
                        <div style={{
                              border: '1px solid var(--c-acid-green)',
                              color: 'var(--c-acid-green)',
                              padding: '0.5rem 1rem',
                              marginBottom: '2rem',
                              fontSize: '0.9rem',
                              letterSpacing: '2px'
                        }}>
                              AI ART EXHIBITION 2026
                        </div>

                        <ChromeTitle text="NEURAL" subtext="Replication" />
                        <ChromeTitle text="DREAMS" subtext="" />

                        {/* Date / Location Block */}
                        <div style={{
                              display: 'flex',
                              gap: '4rem',
                              marginTop: '4rem',
                              fontFamily: 'var(--font-tech)',
                              fontSize: '1.2rem',
                              color: 'var(--c-chrome)',
                              borderTop: '1px solid var(--c-electric-blue)',
                              paddingTop: '2rem'
                        }}>
                              <div>
                                    <span style={{ color: 'var(--c-magenta)' }}>DATE</span><br />
                                    06.24.2026
                              </div>
                              <div>
                                    <span style={{ color: 'var(--c-magenta)' }}>LOC</span><br />
                                    SEOUL // DDP
                              </div>
                        </div>

                  </div>
            </div>
      )
}

export default App
