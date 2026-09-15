import React, { useState } from 'react';
import { LeaveProvider } from './context/LeaveContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ThreeDCursor } from './components/ThreeDCursor';
import { ToastContainer, ToastMessage } from './components/Toast';

import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { LeaveRequestPage } from './pages/LeaveRequestPage';
import { LeaveHistoryPage } from './pages/LeaveHistoryPage';
import { ApprovalCenterPage } from './pages/ApprovalCenterPage';
import { HRDashboardPage } from './pages/HRDashboardPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'leave':
        return <LeaveRequestPage onNavigate={setCurrentPage} onShowToast={showToast} />;
      case 'requests':
        return <LeaveHistoryPage onNavigate={setCurrentPage} onShowToast={showToast} />;
      case 'approvals':
        return <ApprovalCenterPage onShowToast={showToast} />;
      case 'hr':
        return <HRDashboardPage onNavigate={setCurrentPage} />;
      case 'reports':
        return <ReportsPage onShowToast={showToast} />;
      case 'settings':
        return <SettingsPage onShowToast={showToast} />;
      case 'dashboard':
      default:
        return <EmployeeDashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <LeaveProvider>
      <ThreeDCursor />
      <div className="app-container">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        <div className="main-content">
          <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
          <main className="page-wrapper">
            {renderPage()}
          </main>
        </div>
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </LeaveProvider>
  );
};

export default App;
