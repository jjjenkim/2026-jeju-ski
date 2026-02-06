import { motion } from 'framer-motion';

export default function OrganicBlob({ color = "#98FF98", size = "300px", top, left, right, bottom, delay = 0 }) {
      return (
            <motion.div
                  style={{
                        position: 'absolute',
                        top, left, right, bottom,
                        width: size,
                        height: size,
                        backgroundColor: color,
                        borderRadius: '50%',
                        filter: 'blur(60px)',
                        zIndex: 0,
                        opacity: 0.6
                  }}
                  animate={{
                        scale: [1, 1.2, 1],
                        borderRadius: [
                              "40% 60% 70% 30% / 40% 50% 60% 50%",
                              "30% 60% 70% 40% / 50% 60% 30% 60%",
                              "40% 60% 70% 30% / 40% 50% 60% 50%"
                        ],
                        x: [0, 30, -20, 0],
                        y: [0, -30, 20, 0]
                  }}
                  transition={{
                        duration: 8,
                        ease: "easeInOut",
                        repeat: Infinity,
                        delay: delay
                  }}
            />
      );
}
