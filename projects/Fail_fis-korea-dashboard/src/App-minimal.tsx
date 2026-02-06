// 최소한의 import로 테스트
import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
          🎿 FIS 한국 국가대표 대시보드
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
            Tailwind CSS 테스트
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            이 화면이 제대로 보이면 Tailwind CSS가 작동하는 겁니다!
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6 mb-4">
          <p className="text-lg text-gray-700 dark:text-gray-200 mb-4">
            카운터: <span className="font-bold text-blue-600 dark:text-blue-300">{count}</span>
          </p>
          <button
            onClick={() => setCount(count + 1)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            클릭하세요!
          </button>
        </div>

        <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
            ✅ 체크리스트
          </h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>✅ React 작동</li>
            <li>✅ Tailwind CSS 작동</li>
            <li>✅ 다크모드 작동</li>
            <li>⏳ CSV 데이터 로딩 (다음 단계)</li>
            <li>⏳ 차트 표시 (다음 단계)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
