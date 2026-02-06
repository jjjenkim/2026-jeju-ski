// src/components/layout/Header.tsx
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/70 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-korea-red to-korea-blue rounded-lg group-hover:scale-110 transition-transform duration-300 flex items-center justify-center text-white font-bold text-xl">
              🏂
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Team Korea</h1>
              <p className="text-sm text-gray-600">Winter Dashboard 2025-26</p>
            </div>
          </Link>

          <nav className="flex gap-6">
            <Link
              to="/"
              className={`text-gray-700 hover:text-korea-red font-semibold transition-colors duration-200 ${
                isActive('/') ? 'text-korea-red border-b-2 border-korea-red' : ''
              }`}
            >
              대시보드
            </Link>
            <Link
              to="/results"
              className={`text-gray-700 hover:text-korea-red font-semibold transition-colors duration-200 ${
                isActive('/results') ? 'text-korea-red border-b-2 border-korea-red' : ''
              }`}
            >
              최신 결과
            </Link>
            <Link
              to="/links"
              className={`text-gray-700 hover:text-korea-red font-semibold transition-colors duration-200 ${
                isActive('/links') ? 'text-korea-red border-b-2 border-korea-red' : ''
              }`}
            >
              링크
            </Link>
          </nav>
        </div>
      </div>
    </motion.header>
  );
};
