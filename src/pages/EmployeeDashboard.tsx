import React from 'react';
import { useLeave } from '../context/LeaveContext';
import { MetricCard } from '../components/MetricCard';
import { LeaveBalanceCard } from '../components/LeaveBalanceCard';
import { StatusBadge } from '../components/StatusBadge';
import { ApprovalTimeline } from '../components/ApprovalTimeline';
import { QuickAction } from '../components/QuickAction';
import { EmptyState } from '../components/EmptyState';
import {
  Calendar,
  Clock,
  CheckCircle2,
  CalendarPlus,
  History,
  FileText,
  ArrowRight
} from 'lucide-react';

interface EmployeeDashboardProps {
  onNavigate: (page: string) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ onNavigate }) => {
  const { currentUser, leaveRequests } = useLeave();

  // Filter requests for current employee
  const myRequests = leaveRequests.filter(r => r.employeeId === currentUser.id);

  const pendingRequests = myRequests.filter(
    r => !r.isFinalized && (r.status === 'Submitted' || r.status === 'Manager Approved' || r.status === 'HR Approved')
  );

  const approvedThisYear = myRequests.filter(r => r.status === 'Final Approved');
  const totalDaysApproved = approvedThisYear.reduce((acc, r) => acc + r.leaveDays, 0);

  const totalRemainingBalance =
    currentUser.remainingCasualLeave + currentUser.remainingSickLeave + currentUser.remainingEarnedLeave;

  const firstName = currentUser.name.split(' ')[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner */}
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Good morning, {firstName}.
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Here's what's happening with your leave and balances.
        </p>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid-3">
        <MetricCard
          label="Leave Balance"
          value={`${totalRemainingBalance} days`}
          subtext="Available across Casual, Sick & Earned"
          icon={<Calendar size={20} />}
          variant="accent"
        />
        <MetricCard
          label="Pending Requests"
          value={pendingRequests.length}
          subtext={pendingRequests.length === 0 ? "You're all caught up" : "Awaiting manager/HR review"}
          icon={<Clock size={20} />}
          variant="warning"
        />
        <MetricCard
          label="Approved This Year"
          value={`${totalDaysApproved} days`}
          subtext={`${approvedThisYear.length} approved leave requests`}
          icon={<CheckCircle2 size={20} />}
          variant="success"
        />
      </div>

      {/* Main Grid: Quota Balances & Recent Requests */}
      <div className="grid-2">
        {/* Leave Quota Card */}
        <LeaveBalanceCard
          employee={currentUser}
          onApplyClick={() => onNavigate('leave')}
        />

        {/* Quick Actions Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>Quick Actions</h3>
            <p style={{ fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
              Frequently used self-service shortcuts
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <QuickAction
                title="Apply for Leave"
                description="Submit a new vacation, sick, or personal time-off request"
                icon={<CalendarPlus size={20} />}
                onClick={() => onNavigate('leave')}
                accent={true}
              />
              <QuickAction
                title="View Leave History"
                description="Inspect past submissions, manager remarks, and timeline status"
                icon={<History size={20} />}
                onClick={() => onNavigate('requests')}
              />
              <QuickAction
                title="Reports & Analytics"
                description="Explore departmental trends and annual leave summaries"
                icon={<FileText size={20} />}
                onClick={() => onNavigate('reports')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Requests Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem' }}>Recent Requests</h3>
            <p style={{ fontSize: '0.8125rem' }}>Track the progress of your submitted time-off requests</p>
          </div>
          {myRequests.length > 0 && (
            <button
              onClick={() => onNavigate('requests')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--accent-primary)'
              }}
            >
              View all <ArrowRight size={16} />
            </button>
          )}
        </div>

        {myRequests.length === 0 ? (
          <EmptyState
            title="No leave requests yet."
            description="When you need some time away, your requests and real-time approval status will appear here."
            action={{
              label: 'Request Time Off',
              onClick: () => onNavigate('leave')
            }}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {myRequests.slice(0, 3).map(req => (
              <div
                key={req.id}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                        {req.leaveType}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({req.id})</span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      📅 {req.startDate} → {req.endDate} &nbsp;•&nbsp; <strong>{req.leaveDays} {req.leaveDays === 1 ? 'day' : 'days'}</strong>
                    </div>
                  </div>
                  <StatusBadge status={req.status} />
                </div>

                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  "{req.reason}"
                </p>

                {/* Timeline progression */}
                <div style={{ marginTop: '0.25rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                  <ApprovalTimeline request={req} compact={true} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
