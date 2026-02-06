import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { useJsonData } from './hooks/useJsonData';
import { DashboardPage } from './pages/DashboardPage';
import { ResultsPage } from './pages/ResultsPage';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  // Load JSON data from our collected athletes.json
  const { athletes, metadata, statistics, loading, error } = useJsonData();

  const lastUpdated = metadata?.last_updated || new Date().toISOString();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleFileUpload = (file: File) => {
    loadCsvData(file);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1A1D29] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-ksa-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <DashboardLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
        {/* Error State */}
        {error ? (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-between animate-fade-in glass-card">
            <span className="font-semibold flex items-center gap-2">
              ⚠️ 데이터 로드 오류: {error}
            </span>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
            >
              재시도
            </button>
          </div>
        ) : !loading && athletes.length === 0 ? (
          <div className="mb-6 p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 flex flex-col items-center justify-center animate-fade-in glass-card">
            <span className="font-bold text-lg mb-2">데이터가 없습니다</span>
            <span className="text-sm opacity-80 mb-4">CSV 또는 Excel 파일을 확인해주세요.</span>
            <div className="flex gap-4">
              <label className="px-4 py-2 bg-ksa-primary hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-all shadow-lg hover:shadow-blue-500/30">
                파일 직접 업로드
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  className="hidden"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                />
              </label>
            </div>
          </div>
        ) : null}

        <Routes>
          <Route path="/" element={<DashboardPage athletes={athletes} lastUpdated={lastUpdated} darkMode={darkMode} />} />
          <Route path="/results" element={<ResultsPage athletes={athletes} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;
