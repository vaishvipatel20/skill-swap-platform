import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Login from './components/Login';
import OAuthCallback from './components/OAuthCallback';
import Dashboard from './components/Dashboard';
import BrowseSkills from './components/BrowseSkills';
import MySwaps from './components/MySwaps';
import Profile from './components/Profile';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import SwapMonitoring from './components/admin/SwapMonitoring';
import PlatformMessages from './components/admin/PlatformMessages';

const AppContent: React.FC = () => {
  const { currentUser } = useApp();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showOAuthCallback, setShowOAuthCallback] = useState(false);

  const handleLoginSuccess = () => {
    setCurrentPage(currentUser?.role === 'admin' ? 'admin-dashboard' : 'dashboard');
    setShowOAuthCallback(false);
  };

  const handleOAuthError = (error: string) => {
    console.error('OAuth error:', error);
    setShowOAuthCallback(false);
  };

  // Check if current URL is an OAuth callback
  React.useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/auth/google/callback') || path.includes('/auth/apple/callback')) {
      setShowOAuthCallback(true);
    }
  }, []);

  // Show OAuth callback component if processing OAuth
  if (showOAuthCallback) {
    return <OAuthCallback onSuccess={handleLoginSuccess} onError={handleOAuthError} />;
  };

  const renderCurrentPage = () => {
    if (!currentUser) {
      return <Login onSuccess={handleLoginSuccess} onOAuthStart={() => setShowOAuthCallback(true)} />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onPageChange={setCurrentPage} />;
      case 'browse':
        return <BrowseSkills onPageChange={setCurrentPage} />;
      case 'swaps':
        return <MySwaps />;
      case 'profile':
        return <Profile />;
      case 'admin-dashboard':
        return <AdminDashboard onPageChange={setCurrentPage} />;
      case 'user-management':
        return <UserManagement />;
      case 'swap-monitoring':
        return <SwapMonitoring />;
      case 'messages':
        return <PlatformMessages />;
      default:
        return <Dashboard onPageChange={setCurrentPage} />;
    }
  };

  if (!currentUser) {
    return renderCurrentPage();
  }

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderCurrentPage()}
    </Layout>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;