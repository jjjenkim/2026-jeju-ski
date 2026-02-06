import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutGrid, Trophy, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export const V6_BottomNav = () => {
      const navigate = useNavigate();
      const location = useLocation();

      const navItems = [
            { id: 'dashboard', label: 'DASHBOARD', icon: LayoutGrid, path: '/' },
            { id: 'results', label: 'RESULTS', icon: Trophy, path: '/results' },
            { id: 'athletes', label: 'ATHLETES', icon: Users, path: '/athletes' }
      ];

      return (
            <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe flex justify-center">
                  <div className="mx-4 mb-4 glass-card rounded-2xl flex justify-between items-center py-3 px-8 shadow-2xl border-white/10 w-full max-w-sm">
                        {navItems.map((item) => {
                              const isActive = location.pathname === item.path || (item.id === 'athletes' && location.pathname.startsWith('/athletes'));
                              const Icon = item.icon;

                              return (
                                    <button
                                          key={item.id}
                                          onClick={() => navigate(item.path)}
                                          className="flex flex-col items-center justify-center p-1 group relative gap-1"
                                    >
                                          <Icon
                                                size={24}
                                                className={`transition-all duration-300 ${isActive ? 'text-[var(--primary)] scale-110' : 'text-gray-500 group-hover:text-gray-300'}`}
                                                fill={isActive ? "currentColor" : "none"}
                                                fillOpacity={0.2}
                                          />
                                          <span className={`text-[8px] font-black tracking-widest uppercase transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'}`}>
                                                {item.label}
                                          </span>
                                          {isActive && (
                                                <motion.div
                                                      layoutId="nav-active"
                                                      className="absolute -top-1 w-1 h-1 rounded-full bg-[var(--primary)]"
                                                />
                                          )}
                                    </button>
                              );
                        })}
                  </div>
            </nav>
      );
};
