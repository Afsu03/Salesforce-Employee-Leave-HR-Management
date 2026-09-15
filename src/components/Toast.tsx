import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: 380
      }}
    >
      {toasts.map(t => (
        <div
          key={t.id}
          style={{
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.875rem',
            animation: 'slideIn 0.2s ease-out'
          }}
        >
          {t.type === 'success' && <CheckCircle2 size={18} color="var(--success)" />}
          {t.type === 'error' && <AlertCircle size={18} color="var(--error)" />}
          {t.type === 'info' && <Info size={18} color="var(--accent-primary)" />}

          <span style={{ flex: 1 }}>{t.message}</span>

          <button
            onClick={() => onDismiss(t.id)}
            style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
