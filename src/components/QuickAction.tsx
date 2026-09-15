import React from 'react';

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  accent?: boolean;
}

export const QuickAction: React.FC<QuickActionProps> = ({ title, description, icon, onClick, accent = false }) => {
  return (
    <button
      onClick={onClick}
      className="card card-hover"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.25rem',
        textAlign: 'left',
        width: '100%',
        backgroundColor: accent ? 'var(--accent-subtle)' : 'var(--bg-surface)',
        borderColor: accent ? 'rgba(201, 111, 91, 0.3)' : 'var(--border-subtle)'
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 'var(--radius-md)',
          backgroundColor: accent ? 'var(--accent-primary)' : 'var(--bg-subtle)',
          color: accent ? '#FFFFFF' : 'var(--accent-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {icon}
      </div>
      <div>
        <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h4>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{description}</p>
      </div>
    </button>
  );
};
