import React from 'react';
import { useLeave } from '../context/LeaveContext';
import {
  LayoutDashboard,
  CalendarPlus,
  Clock,
  CheckSquare,
  Users,
  BarChart3,
  Sliders,
  Briefcase
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const { leaveRequests, currentUser } = useLeave();

  // Count pending approvals
  const pendingApprovalsCount = leaveRequests.filter(
    r => !r.isFinalized && (r.status === 'Submitted' || r.status === 'Manager Approved' || r.status === 'HR Approved')
  ).length;

  const navItems = [
    { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'leave', label: 'Request Time Off', icon: CalendarPlus },
    { id: 'requests', label: 'Leave History', icon: Clock },
    {
      id: 'approvals',
      label: 'Approval Center',
      icon: CheckSquare,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined
    },
    { id: 'hr', label: 'HR Overview', icon: Users },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings & Architecture', icon: Sliders }
  ];

  return (
    <aside
      style={{
        width: '260px',
        height: '100vh',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 60
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Briefcase size={20} />
        </div>
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.1 }}>Leave &amp; HR Hub</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Salesforce Enterprise</span>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ padding: '1rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'var(--accent-subtle)' : 'transparent',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.875rem',
                width: '100%',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  style={{
                    backgroundColor: isActive ? 'var(--accent-primary)' : 'var(--border-strong)',
                    color: '#FFFFFF',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.1rem 0.45rem',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            backgroundColor: 'var(--accent-primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.875rem'
          }}
        >
          {currentUser.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {currentUser.name}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {currentUser.designation}
          </div>
        </div>
      </div>
    </aside>
  );
};
