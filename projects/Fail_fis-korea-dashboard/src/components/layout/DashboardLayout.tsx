import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
      LayoutDashboard,
      Users,
      Trophy,
      TrendingUp,
      Calendar,
      Menu,
      X,
      Moon,
      Sun
} from 'lucide-react';

interface DashboardLayoutProps {
      children: React.ReactNode;
      darkMode: boolean;
      toggleDarkMode: () => void;
}

export function DashboardLayout({ children, darkMode, toggleDarkMode }: DashboardLayoutProps) {
      const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
      const location = useLocation();

      const navItems = [
            { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
            { label: 'Recent Results', icon: Trophy, path: '/results' },
            { label: 'Athletes', icon: Users, path: '/athletes' }, // Placeholder
            { label: 'Analytics', icon: TrendingUp, path: '/analytics' }, // Placeholder
            { label: 'Schedule', icon: Calendar, path: '/schedule' }, // Placeholder
      ];

      return (
            <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-[#0F172A]' : 'bg-gray-50'}`}>
                  {/* Top Navigation Header */}
                  <header className="fixed top-0 left-0 right-0 h-18 z-50 bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
                        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">

                              {/* Logo Section */}
                              <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ksa-primary to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-black text-lg">
                                          K
                                    </div>
                                    <div className="flex flex-col">
                                          <span className="text-lg font-black tracking-tight text-gray-900 dark:text-white leading-none">
                                                TEAM KOREA
                                          </span>
                                          <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mt-0.5">
                                                Ski & Snowboard Association
                                          </span>
                                    </div>
                              </div>

                              {/* Desktop Navigation - Top Right Rounded Rectangles */}
                              <nav className="hidden lg:flex items-center gap-3">
                                    {navItems.map((item) => {
                                          const isActive = location.pathname === item.path;
                                          return (
                                                <Link
                                                      key={item.label}
                                                      to={item.path}
                                                      className={`
                                                            px-5 py-2.5 rounded-2xl flex items-center gap-2 text-sm font-bold transition-all duration-200
                                                            ${isActive
                                                                  ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20 dark:bg-white dark:text-gray-900 dark:shadow-white/10'
                                                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                                                            }
                                                      `}
                                                >
                                                      <item.icon size={18} />
                                                      <span>{item.label}</span>
                                                </Link>
                                          );
                                    })}

                                    <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2" />

                                    <button
                                          onClick={toggleDarkMode}
                                          className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    >
                                          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                                    </button>
                              </nav>

                              {/* Mobile Menu Trigger */}
                              <div className="lg:hidden flex items-center gap-3">
                                    <button
                                          onClick={toggleDarkMode}
                                          className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                    >
                                          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                                    </button>
                                    <button
                                          onClick={() => setIsMobileMenuOpen(true)}
                                          className="p-2.5 rounded-xl bg-gray-900 text-white shadow-lg"
                                    >
                                          <Menu size={20} />
                                    </button>
                              </div>
                        </div>
                  </header>

                  {/* Mobile Menu Overlay */}
                  {isMobileMenuOpen && (
                        <div className="fixed inset-0 z-[60] lg:hidden">
                              <div
                                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                    onClick={() => setIsMobileMenuOpen(false)}
                              />
                              <div className="absolute top-0 right-0 w-80 h-full bg-white dark:bg-[#1E293B] shadow-2xl p-6 overflow-y-auto">
                                    <div className="flex justify-between items-center mb-8">
                                          <span className="text-xl font-black text-gray-900 dark:text-white">MENU</span>
                                          <button
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                                          >
                                                <X size={24} />
                                          </button>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                          {navItems.map((item) => {
                                                const isActive = location.pathname === item.path;
                                                return (
                                                      <Link
                                                            key={item.label}
                                                            to={item.path}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className={`
                                                                  w-full p-4 rounded-2xl flex items-center gap-4 text-base font-bold transition-all
                                                                  ${isActive
                                                                        ? 'bg-ksa-primary text-white shadow-lg shadow-blue-500/30'
                                                                        : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                                                  }
                                                            `}
                                                      >
                                                            <item.icon size={20} />
                                                            <span>{item.label}</span>
                                                      </Link>
                                                );
                                          })}
                                    </div>
                              </div>
                        </div>
                  )}

                  {/* Main Content */}
                  <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto min-h-screen">
                        {children}
                  </main>
            </div>
      );
}
