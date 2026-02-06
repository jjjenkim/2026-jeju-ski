import { useState } from 'react'
import './styles/sketch.css'
import RoughButton from './components/RoughButton'
import SketchCard from './components/SketchCard'

function App() {
      const [count, setCount] = useState(0)

      return (
            <div className="sketch-container">
                  {/* SVG Filters for "Wiggle" Effect */}
                  <svg style={{ display: 'none' }}>
                        <defs>
                              <filter id="displacementFilter">
                                    <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
                                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
                              </filter>
                        </defs>
                  </svg>

                  <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <p style={{ fontFamily: 'var(--font-notes)', fontSize: '2rem', marginBottom: '0' }}>Jan 31, 2026</p>
                        <h1>My Creative Journal</h1>
                        <p>A collection of raw ideas and messy sketches.</p>

                        <RoughButton onClick={() => setCount(c => c + 1)}>
                              Doodle Me! ({count})
                        </RoughButton>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <SketchCard
                              title="Project Alpha"
                              content="Ideally, we build this with 100% reusable components. Don't forget the coffee stains!"
                              rotate="-3deg"
                        />
                        <SketchCard
                              title="To-Do List"
                              content="- Buy milk\n- Invent future\n- Fix CSS z-index (again)"
                              rotate="2deg"
                        />
                        <SketchCard
                              title="Dream Big"
                              content="What if websites felt less like machines and more like paper?"
                              rotate="-1deg"
                        />
                  </div>

                  <div style={{ marginTop: '4rem', textAlign: 'center', opacity: 0.6 }}>
                        <p style={{ fontSize: '1rem' }}>Hand-coded with ❤️ and ✏️</p>
                  </div>

            </div>
      )
}

export default App
