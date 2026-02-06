import { motion } from 'framer-motion';

export default function SketchCard({ title, content, rotate = "2deg" }) {
      return (
            <motion.div
                  style={{
                        background: '#fff',
                        padding: '2rem',
                        width: '300px',
                        boxShadow: '5px 5px 0px var(--c-pencil)',
                        border: '2px solid var(--c-ink)',
                        rotate: rotate,
                        margin: '2rem'
                  }}
                  whileHover={{ y: -5, boxShadow: '8px 8px 0px var(--c-accent)', rotate: '0deg' }}
            >
                  {/* Tape Effect */}
                  <div style={{
                        position: 'absolute',
                        top: '-15px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '100px',
                        height: '30px',
                        background: 'rgba(255, 255, 255, 0.4)',
                        border: '1px solid rgba(0,0,0,0.1)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        zIndex: 10
                  }}></div>

                  <h3 style={{ fontSize: '2rem', marginTop: 0, fontFamily: 'var(--font-hand)' }}>{title}</h3>
                  <p style={{ fontFamily: 'var(--font-notes)', fontSize: '1.8rem', color: '#666' }}>
                        {content}
                  </p>
            </motion.div>
      );
}
