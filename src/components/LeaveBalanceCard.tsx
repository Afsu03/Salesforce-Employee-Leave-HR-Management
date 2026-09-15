import React from 'react';
import { Employee } from '../types';

interface LeaveBalanceCardProps {
  employee: Employee;
  onApplyClick?: () => void;
}

export const LeaveBalanceCard: React.FC<LeaveBalanceCardProps> = ({ employee, onApplyClick }) => {
  const quotas = [
    {
      type: 'Casual Leave',
      total: employee.totalCasualLeave,
      used: employee.usedCasualLeave,
      remaining: employee.remainingCasualLeave,
      color: 'var(--accent-primary)',
      subtleBg: 'var(--accent-subtle)'
    },
    {
      type: 'Sick Leave',
      total: employee.totalSickLeave,
      used: employee.usedSickLeave,
      remaining: employee.remainingSickLeave,
      color: 'var(--success)',
      subtleBg: 'var(--success-subtle)'
    },
    {
      type: 'Earned Leave',
      total: employee.totalEarnedLeave,
      used: employee.usedEarnedLeave,
      remaining: employee.remainingEarnedLeave,
      color: 'var(--warning)',
      subtleBg: 'var(--warning-subtle)'
    }
  ];

  const totalRemaining = employee.remainingCasualLeave + employee.remainingSickLeave + employee.remainingEarnedLeave;
  const totalAllocated = employee.totalCasualLeave + employee.totalSickLeave + employee.totalEarnedLeave;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem' }}>Your Leave Quotas</h3>
          <p style={{ fontSize: '0.8125rem' }}>Annual allocation with automatic balance deductions</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{totalRemaining}</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}> / {totalAllocated} days left</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {quotas.map(q => {
          const pctUsed = Math.min(100, Math.round((q.used / (q.total || 1)) * 100));
          return (
            <div
              key={q.type}
              style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '0.9rem 1.1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{q.type}</span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '0.9375rem' }}>{q.remaining}</strong> days available ({q.used} used of {q.total})
                </span>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  height: 6,
                  width: '100%',
                  backgroundColor: 'var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${pctUsed}%`,
                    backgroundColor: q.color,
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {onApplyClick && (
        <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onApplyClick} className="btn-primary" style={{ padding: '0.55rem 1.1rem', fontSize: '0.875rem' }}>
            Request Time Off
          </button>
        </div>
      )}
    </div>
  );
};
