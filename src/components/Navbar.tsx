import React, { useState } from 'react';
import { useLeave } from '../context/LeaveContext';
import { Bell, Plus, ShieldCheck } from 'lucide-react';
import { NotificationPanel } from './NotificationPanel';
import { UserRole } from '../types';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const { currentUser, employees, setCurrentUser, userRole, setUserRole, notifications } = useLeave();
  const [showNotifs, setShowNotifs] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
      {/* Left: Current Page indicator & Salesforce DX tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'var(--accent-subtle)',
              color: 'var(--accent-primary)',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)'
            }}
          >
            <ShieldCheck size={12} /> Salesforce DX Declarative Demo
          </span>
        </div>
      </div>

      {/* Right: Controls, Personas, Notifications */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Role Selector Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-subtle)',
            padding: '3px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8125rem'
          }}
        >
          {(['Employee', 'Manager', 'HR'] as UserRole[]).map(role => (
            <button
              key={role}
              onClick={() => setUserRole(role)}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: 'calc(var(--radius-md) - 2px)',
                fontWeight: userRole === role ? 600 : 400,
                backgroundColor: userRole === role ? 'var(--bg-surface)' : 'transparent',
                color: userRole === role ? 'var(--text-primary)' : 'var(--text-secondary)',
                boxShadow: userRole === role ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Persona Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <select
            value={currentUser.id}
            onChange={e => {
              const found = employees.find(emp => emp.id === e.target.value);
              if (found) setCurrentUser(found);
            }}
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.8125rem',
              borderRadius: 'var(--radius-md)',
              width: 'auto'
            }}
          >
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                👤 {emp.name} ({emp.department})
              </option>
            ))}
          </select>
        </div>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            aria-label="Notifications"
            style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              position: 'relative'
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-primary)'
                }}
              />
            )}
          </button>

          <NotificationPanel
            isOpen={showNotifs}
            onClose={() => setShowNotifs(false)}
            onNavigateRequest={_reqId => {
              setShowNotifs(false);
              onNavigate('requests');
            }}
          />
        </div>

        {/* Quick Apply CTA */}
        {currentPage !== 'leave' && (
          <button
            onClick={() => onNavigate('leave')}
            className="btn-primary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            <Plus size={16} /> Request Time Off
          </button>
        )}
      </div>
    </header>
  );
};
