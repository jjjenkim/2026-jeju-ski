import './styles/organic.css'
import OrganicBlob from './components/OrganicBlob'
import GalleryItem from './components/GalleryItem'
import { motion } from 'framer-motion'

function App() {
      return (
            <div className="organic-container">

                  {/* Background Blobs */}
                  <OrganicBlob color="#98FF98" size="400px" top="-100px" left="-100px" />
                  <OrganicBlob color="#A7FFEB" size="300px" top="30%" right="10%" delay={2} />
                  <OrganicBlob color="#FFE0B2" size="350px" bottom="10%" left="20%" delay={4} />

                  {/* Hero Text */}
                  <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        style={{ marginTop: '10vh', marginBottom: '15vh' }}
                  >
                        <h1 className="text-huge">
                              Organic <br />
                              <span style={{ marginLeft: '100px', fontStyle: 'italic' }}>Flow</span>
                        </h1>
                        <p style={{ marginLeft: '10px', fontSize: '1.2rem', maxWidth: '400px', marginTop: '2rem' }}>
                              Breaking the grid to find the human touch in a digital 2026.
                        </p>
                  </motion.div>

                  {/* Anti-Grid Gallery */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0', paddingBottom: '20vh' }}>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <GalleryItem
                                    title="Serene Chaos"
                                    subtitle="Photography"
                                    image="https://images.unsplash.com/photo-1515405295579-ba7f9f92f413?q=80&w=600&auto=format&fit=crop"
                                    width="350px"
                                    rotate="-5deg"
                                    y="0px"
                              />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '-50px' }}>
                              <GalleryItem
                                    title="Minty Fresh"
                                    subtitle="Product Design"
                                    image="https://images.unsplash.com/photo-1629198727546-f9e7102b4859?q=80&w=600&auto=format&fit=crop"
                                    width="300px"
                                    rotate="3deg"
                                    x="50px"
                              />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-30px' }}>
                              <GalleryItem
                                    title="Soft Corners"
                                    subtitle="Architecture"
                                    image="https://images.unsplash.com/photo-1493606278519-11aa9f86e40a?q=80&w=600&auto=format&fit=crop"
                                    width="400px"
                                    rotate="-2deg"
                                    y="50px"
                              />
                        </div>

                  </div>

            </div>
      )
}

export default App
