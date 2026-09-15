import React, { useState, useMemo } from 'react';
import { useLeave } from '../context/LeaveContext';
import { LeaveType } from '../types';
import {
  AlertCircle,
  Info,
  CheckCircle2,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface LeaveRequestPageProps {
  onNavigate: (page: string) => void;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const LeaveRequestPage: React.FC<LeaveRequestPageProps> = ({ onNavigate, onShowToast }) => {
  const { currentUser, employees, submitLeaveRequest } = useLeave();

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(currentUser.id);
  const [leaveType, setLeaveType] = useState<LeaveType>('Casual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Active employee for quota check
  const activeEmployee = employees.find(e => e.id === selectedEmployeeId) || currentUser;

  // Auto-calculate duration (End - Start + 1)
  const leaveDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (isNaN(s.getTime()) || isNaN(e.getTime()) || e < s) return 0;
    const diffTime = Math.abs(e.getTime() - s.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [startDate, endDate]);

  // Available balance for chosen leave type
  const availableBalance = useMemo(() => {
    switch (leaveType) {
      case 'Casual Leave':
        return activeEmployee.remainingCasualLeave;
      case 'Sick Leave':
        return activeEmployee.remainingSickLeave;
      case 'Earned Leave':
        return activeEmployee.remainingEarnedLeave;
      case 'Emergency Leave':
      case 'Unpaid Leave':
        return Infinity;
      default:
        return 0;
    }
  }, [leaveType, activeEmployee]);

  // Validation Checks
  const isDateInvalid = startDate && endDate && new Date(endDate) < new Date(startDate);
  const isBalanceInsufficient = availableBalance !== Infinity && leaveDays > availableBalance;
  const isReasonMissing = isSubmitted && !reason.trim();
  const isFormValid = startDate && endDate && !isDateInvalid && !isBalanceInsufficient && reason.trim().length > 0;

  // Expected Approval Route Description
  const routingDescription = useMemo(() => {
    if (leaveDays === 0) return null;
    if (leaveDays <= 2) {
      return {
        badge: 'Short Duration (1-2 days)',
        route: 'Manager Approval → Final Approved',
        color: 'var(--success)'
      };
    } else if (leaveDays <= 5) {
      return {
        badge: 'Standard Duration (3-5 days)',
        route: 'Manager Approval → HR Review → Final Approved',
        color: 'var(--warning)'
      };
    } else {
      return {
        badge: 'Extended Duration (>5 days)',
        route: 'Manager Approval → HR Review → Final Approver (Leadership) → Final Approved',
        color: 'var(--accent-primary)'
      };
    }
  }, [leaveDays]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!isFormValid) {
      onShowToast('error', 'Please resolve form validation issues before submitting.');
      return;
    }

    const result = submitLeaveRequest({
      employeeId: selectedEmployeeId,
      leaveType,
      startDate,
      endDate,
      reason
    });

    if (result.success) {
      onShowToast('success', result.message);
      onNavigate('requests');
    } else {
      onShowToast('error', result.message);
    }
  };

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Request time off</h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Let your manager know when you'll be away.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Employee Selection */}
        <div>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>
            Employee
          </label>
          <select
            value={selectedEmployeeId}
            onChange={e => setSelectedEmployeeId(e.target.value)}
          >
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name} — {emp.designation} ({emp.department})
              </option>
            ))}
          </select>
        </div>

        {/* Leave Type & Available Balance Indicator */}
        <div className="grid-2">
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>
              Leave Type
            </label>
            <select
              value={leaveType}
              onChange={e => setLeaveType(e.target.value as LeaveType)}
            >
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Earned Leave">Earned Leave</option>
              <option value="Emergency Leave">Emergency Leave</option>
              <option value="Unpaid Leave">Unpaid Leave</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>
              Available Balance
            </label>
            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem 0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{leaveType}</span>
              <span style={{ fontWeight: 700, color: availableBalance === 0 ? 'var(--error)' : 'var(--text-primary)' }}>
                {availableBalance === Infinity ? 'Unlimited' : `${availableBalance} days remaining`}
              </span>
            </div>
          </div>
        </div>

        {/* Dates Grid */}
        <div className="grid-2">
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Real-time Calculated Duration & Quota Status */}
        {startDate && endDate && (
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: isDateInvalid || isBalanceInsufficient ? 'var(--error-subtle)' : 'var(--bg-subtle)',
              border: `1px solid ${isDateInvalid || isBalanceInsufficient ? 'rgba(184, 92, 92, 0.3)' : 'var(--border-subtle)'}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Calculated Duration:</span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: isDateInvalid ? 'var(--error)' : 'var(--text-primary)' }}>
                {isDateInvalid ? 'Invalid Range' : `${leaveDays} ${leaveDays === 1 ? 'day' : 'days'}`}
              </span>
            </div>

            {/* Validation messages */}
            {isDateInvalid && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--error)', fontSize: '0.8125rem' }}>
                <AlertCircle size={15} /> End date cannot be earlier than start date.
              </div>
            )}

            {isBalanceInsufficient && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--error)', fontSize: '0.8125rem' }}>
                <ShieldAlert size={15} /> Insufficient quota: You have {availableBalance} days remaining, but requested {leaveDays} days.
              </div>
            )}

            {!isDateInvalid && !isBalanceInsufficient && leaveDays > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success)', fontSize: '0.8125rem' }}>
                <CheckCircle2 size={15} /> Valid request. Quota balance after approval will be {availableBalance === Infinity ? 'Unlimited' : availableBalance - leaveDays} days.
              </div>
            )}
          </div>
        )}

        {/* Declarative Flow Routing Preview */}
        {routingDescription && !isDateInvalid && (
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.8125rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={16} color="var(--accent-primary)" />
              <span style={{ fontWeight: 600 }}>Approval Path:</span>
              <span style={{ color: 'var(--text-secondary)' }}>{routingDescription.route}</span>
            </div>
            <span
              style={{
                fontSize: '0.725rem',
                fontWeight: 600,
                backgroundColor: 'var(--bg-surface)',
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                color: routingDescription.color,
                border: '1px solid var(--border-subtle)'
              }}
            >
              {routingDescription.badge}
            </span>
          </div>
        )}

        {/* Reason Field */}
        <div>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>
            Reason for Request
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Attending personal family commitment, doctor consultation, vacation, etc."
            value={reason}
            onChange={e => setReason(e.target.value)}
            style={{ borderColor: isReasonMissing ? 'var(--error)' : undefined }}
          />
          {isReasonMissing && (
            <span style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
              Please provide a reason for your leave request.
            </span>
          )}
        </div>

        {/* Form Action CTAs */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isDateInvalid || isBalanceInsufficient}
            style={{ opacity: isDateInvalid || isBalanceInsufficient ? 0.6 : 1 }}
          >
            Submit Request <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};
