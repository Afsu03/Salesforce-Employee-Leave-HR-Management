import React from 'react';
import { LeaveStatus } from '../types';

interface StatusBadgeProps {
  status: LeaveStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getBadgeClass = (s: LeaveStatus) => {
    switch (s) {
      case 'Submitted':
        return 'badge-submitted';
      case 'Manager Approved':
        return 'badge-manager-approved';
      case 'HR Approved':
        return 'badge-hr-approved';
      case 'Final Approved':
        return 'badge-final-approved';
      case 'Rejected':
        return 'badge-rejected';
      case 'Cancelled':
        return 'badge-cancelled';
      case 'Draft':
      default:
        return 'badge-draft';
    }
  };

  return (
    <span
      className={`badge ${getBadgeClass(status)}`}
      style={{
        fontSize: size === 'sm' ? '0.725rem' : '0.8125rem',
        padding: size === 'sm' ? '0.15rem 0.5rem' : '0.25rem 0.65rem'
      }}
    >
      <span className="status-dot" />
      {status}
    </span>
  );
};
