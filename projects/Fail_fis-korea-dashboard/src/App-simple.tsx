function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#003DA5' }}>FIS 한국 국가대표 대시보드</h1>
      <p>테스트: 이 화면이 보이면 React는 작동합니다!</p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <p>✅ React 로딩 성공</p>
        <p>⏳ CSV 데이터 로딩 중...</p>
      </div>
    </div>
  );
}

export default App;
