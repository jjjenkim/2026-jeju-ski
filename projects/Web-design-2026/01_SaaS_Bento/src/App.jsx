import React from 'react';
import { BentoGrid } from './components/BentoGrid';
import './App.css';

function App() {
      return (
            <div className="app-container">
                  <header className="container" style={{ padding: '80px 24px 60px', textAlign: 'center' }}>
                        <h1 style={{ marginBottom: '24px', letterSpacing: '-0.03em' }}>NextGen SaaS 2026</h1>
                        <p style={{
                              fontSize: '1.25rem',
                              color: 'var(--color-text-secondary)',
                              maxWidth: '600px',
                              margin: '0 auto',
                              lineHeight: '1.6'
                        }}>
                              Building trust through performance. The future of software is fast, reliable, and human-centric.
                        </p>
                  </header>

                  <main>
                        <BentoGrid />
                  </main>

                  <footer className="container" style={{
                        padding: '80px 24px',
                        textAlign: 'center',
                        color: 'var(--color-text-secondary)',
                        borderTop: '1px solid var(--color-border)',
                        marginTop: '80px',
                        fontSize: '0.875rem'
                  }}>
                        <p style={{ marginBottom: '8px' }}>© 2026 Web Design Trends Showcase</p>
                        <p style={{ opacity: 0.6 }}>Designed with Cloud Dancer Palette & Bento Grid Architecture</p>
                  </footer>
            </div>
      )
}

export default App;
