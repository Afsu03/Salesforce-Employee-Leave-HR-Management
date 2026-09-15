import React from 'react';
import { useLeave } from '../context/LeaveContext';
import { Bell, CheckCheck, X } from 'lucide-react';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateRequest?: (requestId: string) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose, onNavigateRequest }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useLeave();

  if (!isOpen) return null;

  return (
    <div
      className="card"
      style={{
        position: 'absolute',
        top: '64px',
        right: '1.5rem',
        width: 360,
        maxHeight: 460,
        boxShadow: 'var(--shadow-lg)',
        zIndex: 1000,
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        animation: 'fadeIn 0.15s ease-out'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell size={18} color="var(--accent-primary)" />
          <h4 style={{ fontSize: '0.9375rem' }}>Notifications</h4>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={markAllNotificationsRead}
            title="Mark all as read"
            style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <CheckCheck size={14} /> Read all
          </button>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={16} />
          </button>
        </div>
      </div>

      <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingRight: '2px' }}>
        {notifications.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: '0.8125rem', padding: '1.5rem 0', color: 'var(--text-muted)' }}>
            You're all caught up! No notifications.
          </p>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id);
                if (n.requestId && onNavigateRequest) onNavigateRequest(n.requestId);
              }}
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: n.read ? 'transparent' : 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
                transition: 'background-color 0.15s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{n.title}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{n.timestamp}</span>
              </div>
              <p style={{ fontSize: '0.775rem', marginTop: '0.25rem', color: 'var(--text-secondary)' }}>{n.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
