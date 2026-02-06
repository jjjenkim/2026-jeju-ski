import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { V6_DashboardPage as DashboardPage } from './pages/V6_DashboardPage';
import { V6_ResultsPage as ResultsPage } from './pages/V6_ResultsPage';
import { V6_AthletesPage as AthletesPage } from './pages/V6_AthletesPage';
import { V6_BottomNav as BottomNav } from './components/layout/V6_BottomNav';

function App() {
  return (
    <Router>
      <div className="min-h-screen relative">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/athletes" element={<AthletesPage />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
