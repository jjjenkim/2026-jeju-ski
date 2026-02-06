import { useState } from 'react';

function App() {
  const [step, setStep] = useState(1);

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#003DA5', borderBottom: '3px solid #C8102E', paddingBottom: '10px' }}>
        🎿 FIS 한국 국가대표 대시보드 - 디버그 모드
      </h1>

      <div style={{ marginTop: '30px', backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px' }}>
        <h2>단계별 테스트</h2>
        <p>현재 단계: <strong>Step {step}</strong></p>

        <button
          onClick={() => setStep(step + 1)}
          style={{ padding: '10px 20px', backgroundColor: '#003DA5', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}
        >
          다음 단계
        </button>

        <button
          onClick={() => setStep(1)}
          style={{ padding: '10px 20px', backgroundColor: '#C8102E', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          처음으로
        </button>
      </div>

      <div style={{ marginTop: '30px' }}>
        {step >= 1 && (
          <div style={{ padding: '15px', backgroundColor: '#e8f5e9', borderLeft: '4px solid #4caf50', marginBottom: '10px' }}>
            ✅ Step 1: React 기본 작동 - 성공!
          </div>
        )}

        {step >= 2 && (
          <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderLeft: '4px solid #2196f3', marginBottom: '10px' }}>
            ✅ Step 2: useState Hook - 성공!
          </div>
        )}

        {step >= 3 && (
          <TestImports />
        )}
      </div>
    </div>
  );
}

function TestImports() {
  return (
    <div style={{ padding: '15px', backgroundColor: '#fff3e0', borderLeft: '4px solid #ff9800', marginBottom: '10px' }}>
      ⏳ Step 3: 타입 import 테스트 중...
      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        types.ts에서 Athlete 타입을 불러오는 중입니다.
      </p>
    </div>
  );
}

export default App;
