import React from 'react';
import { LeaveRequest } from '../types';
import { Check, X, Clock } from 'lucide-react';

interface ApprovalTimelineProps {
  request: LeaveRequest;
  compact?: boolean;
}

export const ApprovalTimeline: React.FC<ApprovalTimelineProps> = ({ request, compact = false }) => {
  const { leaveDays, status } = request;

  // Determine required steps based on duration routing rules
  const steps: { key: string; label: string }[] = [
    { key: 'Submitted', label: 'Submitted' },
    { key: 'Manager', label: 'Manager Review' }
  ];

  if (leaveDays > 2) {
    steps.push({ key: 'HR', label: 'HR Review' });
  }

  if (leaveDays > 5) {
    steps.push({ key: 'Final', label: 'Final Approval' });
  }

  steps.push({ key: 'Decision', label: status === 'Rejected' ? 'Rejected' : 'Approved' });

  // Compute status index
  const getActiveStepIndex = () => {
    if (status === 'Submitted') return 1; // At Manager Review
    if (status === 'Manager Approved') {
      return leaveDays > 2 ? 2 : steps.length - 1;
    }
    if (status === 'HR Approved') {
      return leaveDays > 5 ? 3 : steps.length - 1;
    }
    if (status === 'Final Approved' || status === 'Rejected' || status === 'Cancelled') {
      return steps.length - 1;
    }
    return 0;
  };

  const activeIndex = getActiveStepIndex();
  const isRejected = status === 'Rejected' || status === 'Cancelled';
  const isCompleted = status === 'Final Approved';

  return (
    <div style={{ padding: compact ? '0.5rem 0' : '1rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        {/* Background Connecting Line */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '20px',
            right: '20px',
            height: '2px',
            backgroundColor: 'var(--border-subtle)',
            transform: 'translateY(-50%)',
            zIndex: 1
          }}
        />

        {steps.map((step, index) => {
          let stepState: 'completed' | 'current' | 'upcoming' | 'rejected' = 'upcoming';

          if (isRejected && index === steps.length - 1) {
            stepState = 'rejected';
          } else if (index < activeIndex || (isCompleted && index === steps.length - 1)) {
            stepState = 'completed';
          } else if (index === activeIndex) {
            stepState = isRejected ? 'rejected' : isCompleted ? 'completed' : 'current';
          }

          const getBgColor = () => {
            if (stepState === 'completed') return 'var(--success)';
            if (stepState === 'rejected') return 'var(--error)';
            if (stepState === 'current') return 'var(--accent-primary)';
            return 'var(--bg-surface)';
          };

          const getTextColor = () => {
            if (stepState === 'completed' || stepState === 'rejected' || stepState === 'current') {
              return '#FFFFFF';
            }
            return 'var(--text-muted)';
          };

          const getBorder = () => {
            if (stepState === 'upcoming') return '2px solid var(--border-subtle)';
            return 'none';
          };

          return (
            <div
              key={step.key}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                zIndex: 2,
                flex: 1
              }}
            >
              <div
                style={{
                  width: compact ? 24 : 30,
                  height: compact ? 24 : 30,
                  borderRadius: '50%',
                  backgroundColor: getBgColor(),
                  color: getTextColor(),
                  border: getBorder(),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: stepState === 'current' ? '0 0 0 4px rgba(201, 111, 91, 0.16)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {stepState === 'completed' && <Check size={compact ? 12 : 16} strokeWidth={2.5} />}
                {stepState === 'rejected' && <X size={compact ? 12 : 16} strokeWidth={2.5} />}
                {stepState === 'current' && <Clock size={compact ? 12 : 14} strokeWidth={2.5} />}
                {stepState === 'upcoming' && (
                  <span style={{ fontSize: compact ? '0.65rem' : '0.75rem', fontWeight: 600 }}>{index + 1}</span>
                )}
              </div>

              {!compact && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: stepState === 'current' ? 600 : 500,
                    color: stepState === 'current' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    marginTop: '0.4rem',
                    textAlign: 'center',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {step.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
