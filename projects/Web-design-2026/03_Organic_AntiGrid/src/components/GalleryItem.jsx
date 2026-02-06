import { motion } from 'framer-motion';

export default function GalleryItem({ title, subtitle, image, x, y, rotate, width = "300px" }) {
      return (
            <motion.div
                  className="glass-card"
                  style={{
                        position: 'relative', // Changed from absolute to relative for flow, or keep absolute if strict anti-grid
                        width: width,
                        marginLeft: x,
                        marginTop: y,
                        rotate: rotate,
                        zIndex: 10
                  }}
                  whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                  <div style={{
                        width: '100%',
                        height: '200px',
                        backgroundColor: '#e0e0e0',
                        borderRadius: '24px',
                        marginBottom: '1.5rem',
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                  }} />
                  <h3 style={{ fontSize: '1.5rem', fontFamily: 'serif' }}>{title}</h3>
                  <p style={{ color: 'var(--c-text-light)', marginTop: '0.5rem' }}>{subtitle}</p>
            </motion.div>
      );
}
