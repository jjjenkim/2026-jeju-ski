import React from 'react';
import { Menu, X } from 'lucide-react';

interface LayoutProps {
      children: React.ReactNode;
      currentPage: string;
      onNavigate: (page: 'DASHBOARD' | 'RESULTS') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
      const [isMenuOpen, setIsMenuOpen] = React.useState(false);

      return (
            <div className="min-h-screen bg-dye-black text-white selection:bg-kor-red selection:text-white overflow-x-hidden">
                  {/* Noir Backdrop / Ambient Light */}
                  <div className="fixed inset-0 pointer-events-none z-0">
                        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-kor-blue/10 blur-[120px] rounded-full" />
                        <div className="absolute bottom-[-10%] right-0 w-[800px] h-[400px] bg-kor-red/5 blur-[100px] rounded-full" />
                  </div>

                  {/* Navigation */}
                  <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-dye-black/80 backdrop-blur-xl">
                        <div className="max-w-[1800px] mx-auto px-6 h-20 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-8 bg-gradient-to-b from-kor-red to-kor-blue" />
                                    <div className="flex flex-col">
                                          <span className="font-display text-2xl tracking-tight leading-none text-white">TEAM KOREA</span>
                                          <span className="text-[10px] tracking-[0.2em] text-steel font-medium">WINTER 2026 OFFICIAL</span>
                                    </div>
                              </div>

                              {/* Desktop Nav */}
                              <div className="hidden md:flex gap-1">
                                    <NavButton
                                          label="DASHBOARD"
                                          active={currentPage === 'DASHBOARD'}
                                          onClick={() => onNavigate('DASHBOARD')}
                                    />
                                    <NavButton
                                          label="RESULTS & RANKING"
                                          active={currentPage === 'RESULTS'}
                                          onClick={() => onNavigate('RESULTS')}
                                    />
                              </div>

                              {/* Mobile Menu Toggle */}
                              <button
                                    className="md:hidden p-2 text-white/70 hover:text-white"
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                              >
                                    {isMenuOpen ? <X /> : <Menu />}
                              </button>
                        </div>
                  </nav>

                  {/* Mobile Nav Overlay */}
                  {isMenuOpen && (
                        <div className="fixed inset-0 z-40 bg-dye-black/95 backdrop-blur-xl pt-24 px-6 md:hidden">
                              <div className="flex flex-col gap-4">
                                    <MobileNavButton
                                          label="DASHBOARD"
                                          active={currentPage === 'DASHBOARD'}
                                          onClick={() => { onNavigate('DASHBOARD'); setIsMenuOpen(false); }}
                                    />
                                    <MobileNavButton
                                          label="RESULTS & RANKING"
                                          active={currentPage === 'RESULTS'}
                                          onClick={() => { onNavigate('RESULTS'); setIsMenuOpen(false); }}
                                    />
                              </div>
                        </div>
                  )}

                  {/* Main Content Area */}
                  <main className="relative z-10 pt-28 px-4 md:px-8 max-w-[1800px] mx-auto pb-20">
                        {children}
                  </main>

                  {/* Footer */}
                  <footer className="relative z-10 border-t border-white/5 py-12 text-center">
                        <p className="text-steel text-sm tracking-widest uppercase">Powered by Antigravity Engine V3</p>
                  </footer>
            </div>
      );
};

const NavButton = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
      <button
            onClick={onClick}
            className={`
      px-6 py-2 text-sm font-medium tracking-wide transition-all duration-300 relative overflow-hidden group
      ${active ? 'text-white' : 'text-steel hover:text-white'}
    `}
      >
            <span className="relative z-10">{label}</span>
            {active && <div className="absolute bottom-0 left-0 w-full h-[1px] bg-kor-red shadow-[0_0_10px_#E61B3F]" />}
            <div className={`absolute inset-0 bg-white/5 transform origin-left transition-transform duration-300 ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
      </button>
);

const MobileNavButton = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
      <button
            onClick={onClick}
            className={`
        w-full text-left py-4 text-2xl font-display uppercase tracking-wider border-b border-white/5
        ${active ? 'text-kor-red' : 'text-white'}
      `}
      >
            {label}
      </button>
);
