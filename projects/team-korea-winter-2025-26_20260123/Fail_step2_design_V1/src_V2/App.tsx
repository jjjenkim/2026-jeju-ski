import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAthleteData } from './hooks/useAthleteData'
import { Spinner } from './components/common/Spinner'
import { BottomNav } from './components/common/BottomNav'
import { DashboardPage } from './pages/DashboardPage'
import { ResultsPage } from './pages/ResultsPage'
import { ProfilePage } from './pages/ProfilePage'
import { AnalysisPage } from './pages/AnalysisPage'

function App() {
  const { data, loading, error } = useAthleteData()

  if (loading) return <Spinner />
  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-background-dark text-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
        <p className="text-white/60">{error.message}</p>
      </div>
    </div>
  )
  if (!data) return (
    <div className="flex items-center justify-center min-h-screen bg-background-dark text-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold">No Data Available</h2>
      </div>
    </div>
  )

  return (
    <Router>
      <div className="dark min-h-screen bg-background-dark text-white max-w-[480px] mx-auto relative font-sans">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/analysis/:type" element={<AnalysisPage />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  )
}

export default App
