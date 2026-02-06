import { Moon, Sun, Upload } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onFileUpload: (file: File) => void;
}

export function Header({ darkMode, toggleDarkMode, onFileUpload }: HeaderProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <header className="bg-ksa-primary dark:bg-ksa-dark border-b border-ksa-secondary dark:border-ksa-dark-border sticky top-0 z-50">
      <div className="w-full px-4 md:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-ksa-secondary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg md:text-xl">KSA</span>
            </div>
            <div>
              <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-white whitespace-nowrap">
                FIS 한국 국가대표 대시보드
              </h1>
              <p className="text-ksa-accent/80 text-xs md:text-sm whitespace-nowrap">
                Korea National Ski Team Dashboard 2025/26
              </p>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* CSV Upload */}
            <label className="cursor-pointer flex items-center space-x-2 px-3 md:px-4 py-2 bg-ksa-secondary hover:bg-red-700 text-white rounded-md transition-colors duration-200">
              <Upload size={18} />
              <span className="hidden sm:inline text-sm md:text-base">CSV</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
