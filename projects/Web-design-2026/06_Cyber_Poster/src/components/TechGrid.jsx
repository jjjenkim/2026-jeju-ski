export default function TechGrid() {
      return (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
                  {/* Central Crosshair */}
                  <div style={{
                        position: 'absolute',
                        top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '60vw', height: '60vw',
                        border: '1px solid rgba(20, 0, 198, 0.2)',
                        borderRadius: '50%',
                  }}></div>

                  {/* Grid Lines */}
                  <div style={{
                        position: 'absolute',
                        top: 0, left: '10%',
                        width: '1px', height: '100%',
                        background: 'rgba(255,255,255,0.05)'
                  }}></div>
                  <div style={{
                        position: 'absolute',
                        top: 0, right: '10%',
                        width: '1px', height: '100%',
                        background: 'rgba(255,255,255,0.05)'
                  }}></div>

                  {/* Floating HUD Elements */}
                  <div style={{
                        position: 'absolute',
                        top: '50px', left: '50px',
                        color: 'var(--c-acid-green)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem'
                  }}>
                        SYSTEM.RDY<br />
                        V.2026.06
                  </div>

                  <div style={{
                        position: 'absolute',
                        bottom: '50px', right: '50px',
                        color: 'var(--c-neon-red)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        textAlign: 'right'
                  }}>
                        COORD: 34.0522° N<br />
                        STATUS: UNSTABLE
                  </div>
            </div>
      );
}
