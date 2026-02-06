import { motion } from 'framer-motion';

export default function RoughButton({ children, onClick }) {
      return (
            <div style={{ position: 'relative', display: 'inline-block', margin: '1rem' }}>

                  {/* SVG Container for the scribbled border */}
                  <motion.svg
                        width="160"
                        height="60"
                        viewBox="0 0 160 60"
                        style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible', zIndex: 0 }}
                        whileHover={{ scale: 1.05 }}
                  >
                        <motion.path
                              d="M10,10 Q40,5 80,10 T150,10 Q155,30 150,50 T80,55 T10,50 Q5,30 10,10"
                              fill="none"
                              stroke="var(--c-ink)"
                              strokeWidth="3"
                              strokeLinecap="round"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 1, type: "spring" }}
                              style={{ vectorEffect: 'non-scaling-stroke' }} // Keeps stroke width constant
                        />
                        {/* Scribble fill on hover */}
                        <motion.path
                              d="M15,15 L145,15 L145,45 L15,45 Z"
                              fill="transparent"
                              stroke="var(--c-accent)"
                              strokeWidth="2"
                              strokeDasharray="4 2"
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 0.3 }}
                        />
                  </motion.svg>

                  <button
                        onClick={onClick}
                        style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--c-ink)',
                              fontFamily: 'var(--font-hand)',
                              fontSize: '1.2rem',
                              width: '160px',
                              height: '60px',
                              cursor: 'pointer',
                              position: 'relative',
                              zIndex: 1
                        }}
                  >
                        {children}
                  </button>
            </div>
      );
}
