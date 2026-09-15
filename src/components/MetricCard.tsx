import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'warning';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon,
  variant = 'default'
}) => {
  const getIconBg = () => {
    switch (variant) {
      case 'accent':
        return 'var(--accent-subtle)';
      case 'success':
        return 'var(--success-subtle)';
      case 'warning':
        return 'var(--warning-subtle)';
      default:
        return 'var(--bg-subtle)';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'accent':
        return 'var(--accent-primary)';
      case 'success':
        return 'var(--success)';
      case 'warning':
        return 'var(--warning)';
      default:
        return 'var(--text-secondary)';
    }
  };

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label}
        </span>
        {icon && (
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-md)',
              backgroundColor: getIconBg(),
              color: getIconColor(),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <div>
        <div style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
          {value}
        </div>
        {subtext && (
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
};
