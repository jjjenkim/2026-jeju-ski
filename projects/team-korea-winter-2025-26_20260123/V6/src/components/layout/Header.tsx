import { motion } from 'framer-motion';
import { Menu, Search } from 'lucide-react';

export const Header = () => {
      return (
            <motion.header
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
            >
                  <div className="max-w-7xl mx-auto glass-card rounded-full px-6 py-3 flex items-center justify-between bg-white/5 backdrop-blur-xl border-white/10">
                        {/* Logo Area */}
                        <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-korea-red to-korea-blue shadow-[0_0_15px_rgba(198,12,48,0.5)]" />
                              <span className="font-display font-bold text-lg tracking-tight">
                                    TEAM KOREA <span className="text-korea-red text-xs align-top">26</span>
                              </span>
                        </div>

                        {/* Navigation (Desktop) */}
                        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                              <a href="#" className="hover:text-white transition-colors">Dashboard</a>
                              <a href="#" className="hover:text-white transition-colors">Athletes</a>
                              <a href="#" className="hover:text-white transition-colors">Schedule</a>
                              <a href="#" className="hover:text-white transition-colors">Medals</a>
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <Search className="w-5 h-5" />
                              </button>
                              <button className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <Menu className="w-5 h-5" />
                              </button>
                        </div>
                  </div>
            </motion.header>
      );
};
