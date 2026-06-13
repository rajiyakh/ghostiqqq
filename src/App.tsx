import { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import QuestDashboard from './components/QuestDashboard';
import AdminDashboard from './components/AdminDashboard';
import type { Page } from './types';

function App() {
  const [page, setPage] = useState<Page>('home');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('ref')) {
      setPage('quest');
    }
    if (window.location.hash === '#admin') {
      setPage('admin');
    }
  }, []);

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') setPage('admin');
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleEnterWorld = () => {
    setPage('quest');
  };

  const handleBack = () => {
    setPage('home');
    window.location.hash = '';
  };

  return (
    <div className="min-h-screen">
      {page === 'home' && <HomePage onEnter={handleEnterWorld} />}
      {page === 'quest' && <QuestDashboard onBack={handleBack} />}
      {page === 'admin' && <AdminDashboard onBack={handleBack} />}
    </div>
  );
}

export default App;
