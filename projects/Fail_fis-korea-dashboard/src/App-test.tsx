import { useState } from 'react';
import { useCsvData } from './hooks/useCsvData';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const { athletes, loading, error, loadCsvData } = useCsvData('/sample-athletes.csv');

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1 style={{ color: '#003DA5' }}>FIS 한국 국가대표 대시보드</h1>
        <p>데이터 로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1 style={{ color: '#C8102E' }}>오류 발생</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <div style={{ backgroundColor: '#003DA5', color: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h1 style={{ margin: '0' }}>🎿 FIS 한국 국가대표 대시보드</h1>
        <p style={{ margin: '10px 0 0 0' }}>Korea National Ski Team Dashboard 2025/26</p>
      </div>

      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ color: '#003DA5', marginTop: '0' }}>✅ 데이터 로딩 성공!</h2>
        <p><strong>총 선수 수:</strong> {athletes.length}명</p>
        <p><strong>종목:</strong> {Array.from(new Set(athletes.map(a => a.종목))).join(', ')}</p>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
        <h2 style={{ color: '#003DA5', marginTop: '0' }}>선수 목록 (처음 5명)</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#003DA5', color: 'white' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>선수명</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>종목</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>연령대</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>소속</th>
            </tr>
          </thead>
          <tbody>
            {athletes.slice(0, 5).map((athlete, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{athlete.선수명}</td>
                <td style={{ padding: '10px' }}>{athlete.종목}</td>
                <td style={{ padding: '10px' }}>{athlete.연령대}</td>
                <td style={{ padding: '10px' }}>{athlete.소속}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.csv';
          input.onchange = (e: any) => {
            const file = e.target.files?.[0];
            if (file) loadCsvData(file);
          };
          input.click();
        }}
        style={{
          marginTop: '20px',
          padding: '15px 30px',
          backgroundColor: '#C8102E',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        📁 CSV 파일 업로드
      </button>

      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          marginTop: '20px',
          marginLeft: '10px',
          padding: '15px 30px',
          backgroundColor: darkMode ? '#FFD700' : '#003DA5',
          color: darkMode ? '#000' : '#fff',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        {darkMode ? '☀️ 라이트 모드' : '🌙 다크 모드'}
      </button>
    </div>
  );
}

export default App;
