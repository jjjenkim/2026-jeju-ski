import { useState, useEffect } from 'react';
import Papa from 'papaparse';

// 타입을 파일 내부에 정의 (import 에러 방지)
interface Athlete {
  종목: string;
  세부종목: string;
  연령대: string;
  선수명: string;
  생년: string;
  소속: string;
  FIS코드: string;
  Sector코드: string;
  시즌: string;
  FIS프로필URL: string;
}

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 다크모드 적용
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // CSV 로딩
    fetch('/sample-athletes.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const cleanData = results.data.map((row: any) => {
              const cleanRow: any = {};
              Object.keys(row).forEach(key => {
                const cleanKey = key.replace(/^\uFEFF/, '').trim();
                cleanRow[cleanKey] = row[key];
              });
              return cleanRow;
            });
            setAthletes(cleanData as Athlete[]);
            setLoading(false);
          }
        });
      })
      .catch(err => {
        console.error('CSV 로딩 에러:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  const disciplines = Array.from(new Set(athletes.map(a => a.종목)));
  const ageGroups = Array.from(new Set(athletes.map(a => a.연령대)));

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-blue-600 dark:bg-gray-800 border-b border-red-600 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                🎿 FIS 한국 국가대표 대시보드
              </h1>
              <p className="text-white/80 text-sm mt-1">
                Korea National Ski Team Dashboard 2025/26
              </p>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">전체 선수</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {athletes.length}
              <span className="text-lg text-gray-500 dark:text-gray-400 ml-1">명</span>
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">참가 종목</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {disciplines.length}
              <span className="text-lg text-gray-500 dark:text-gray-400 ml-1">종목</span>
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">연령대</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {ageGroups.length}
              <span className="text-lg text-gray-500 dark:text-gray-400 ml-1">그룹</span>
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">시즌</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              2025/26
            </p>
          </div>
        </div>

        {/* 종목별 선수 분포 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            종목별 선수 분포
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {disciplines.map(discipline => {
              const count = athletes.filter(a => a.종목 === discipline).length;
              return (
                <div key={discipline} className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{discipline}</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{count}명</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 선수 테이블 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              선수 상세 목록
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-600 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">순번</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">선수명</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">종목</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">세부종목</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">연령대</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">소속</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-white">FIS 프로필</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {athletes.map((athlete, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{index + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{athlete.선수명}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{athlete.종목}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{athlete.세부종목}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {athlete.연령대}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{athlete.소속}</td>
                    <td className="px-4 py-3 text-center">
                      <a
                        href={athlete.FIS프로필URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        🔗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              총 <span className="font-bold text-blue-600 dark:text-blue-400">{athletes.length}명</span>의 선수
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© 2025 대한스키협회 (Korea Ski Association) | FIS 한국 국가대표 대시보드</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
