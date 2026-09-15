import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3.5rem 2rem',
        textAlign: 'center',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border-strong)',
        maxWidth: 540,
        margin: '1.5rem auto'
      }}
    >
      {icon && (
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}
        >
          {icon}
        </div>
      )}
      <h3 style={{ fontSize: '1.125rem', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>{title}</h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: 380, lineHeight: 1.5, marginBottom: action ? '1.25rem' : '0' }}>
        {description}
      </p>
      {action && (
        <button onClick={action.onClick} className="btn-primary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.875rem' }}>
          {action.label}
        </button>
      )}
    </div>
  );
};
