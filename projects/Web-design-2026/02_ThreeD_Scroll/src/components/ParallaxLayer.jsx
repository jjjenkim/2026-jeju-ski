import { motion, useScroll, useTransform } from 'framer-motion';

export default function ParallaxLayer({ children, offset = 0, speed = 1, className = '' }) {
      const { scrollY } = useScroll();
      const y = useTransform(scrollY, [0, 1000], [0, offset * speed]);
      const opacity = useTransform(scrollY, [0, 300], [1, 0.5]);

      return (
            <motion.div
                  style={{ y, opacity }}
                  className={`layer ${className}`}
            >
                  {children}
            </motion.div>
      );
}
