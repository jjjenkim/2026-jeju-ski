import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/dashboard/Dashboard';
import { Results } from './components/results/Results';

type Page = 'DASHBOARD' | 'RESULTS';

function App() {
      const [currentPage, setCurrentPage] = useState<Page>('DASHBOARD');

      return (
            <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
                  {currentPage === 'DASHBOARD' && <Dashboard />}
                  {currentPage === 'RESULTS' && <Results />}
            </Layout>
      );
}

export default App;
