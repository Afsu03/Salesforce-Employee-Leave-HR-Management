import React, { useState, useMemo } from 'react';
import { useLeave } from '../context/LeaveContext';
import { LeaveRequest } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ApprovalTimeline } from '../components/ApprovalTimeline';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import {
  Search,
  Filter,
  Eye,
  XCircle,
  CalendarPlus
} from 'lucide-react';

interface LeaveHistoryPageProps {
  onNavigate: (page: string) => void;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const LeaveHistoryPage: React.FC<LeaveHistoryPageProps> = ({ onNavigate, onShowToast }) => {
  const { leaveRequests, currentUser, cancelLeaveRequest } = useLeave();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [activeModalRequest, setActiveModalRequest] = useState<LeaveRequest | null>(null);

  const filteredRequests = useMemo(() => {
    return leaveRequests.filter(req => {
      const matchesSearch =
        req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.employeeName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = selectedStatus === 'All' || req.status === selectedStatus;
      const matchesType = selectedType === 'All' || req.leaveType === selectedType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [leaveRequests, searchQuery, selectedStatus, selectedType]);

  const handleCancel = (requestId: string) => {
    if (window.confirm('Are you sure you want to cancel this leave request?')) {
      const result = cancelLeaveRequest(requestId);
      if (result.success) {
        onShowToast('info', result.message);
        setActiveModalRequest(null);
      } else {
        onShowToast('error', result.message);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Leave History &amp; Requests</h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Complete audit trail of all employee leave applications and status transitions.
          </p>
        </div>
        <button
          onClick={() => onNavigate('leave')}
          className="btn-primary"
        >
          <CalendarPlus size={16} /> Request Leave
        </button>
      </div>

      {/* Filters Bar */}
      <div
        className="card"
        style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search by ID, name, or reason..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>

        {/* Status filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--text-secondary)" />
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Manager Approved">Manager Approved</option>
            <option value="HR Approved">HR Approved</option>
            <option value="Final Approved">Final Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Type filter */}
        <div>
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="All">All Leave Types</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Earned Leave">Earned Leave</option>
            <option value="Emergency Leave">Emergency Leave</option>
            <option value="Unpaid Leave">Unpaid Leave</option>
          </select>
        </div>
      </div>

      {/* Table of requests */}
      {filteredRequests.length === 0 ? (
        <EmptyState
          title="No leave requests found."
          description="Try adjusting your filters or submit a new time-off application."
          action={{
            label: 'Request Leave',
            onClick: () => onNavigate('leave')
          }}
        />
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Dates</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Current Tier</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map(req => (
                <tr key={req.id}>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{req.id}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{req.employeeName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.department}</div>
                  </td>
                  <td>{req.leaveType}</td>
                  <td>
                    <div style={{ fontSize: '0.8125rem' }}>{req.startDate}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>to {req.endDate}</div>
                  </td>
                  <td>
                    <strong>{req.leaveDays}</strong> {req.leaveDays === 1 ? 'day' : 'days'}
                  </td>
                  <td>
                    <StatusBadge status={req.status} size="sm" />
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {req.approvalLevel === 'None' ? '—' : `${req.approvalLevel}`}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        onClick={() => setActiveModalRequest(req)}
                        className="btn-secondary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.775rem' }}
                      >
                        <Eye size={14} /> Details
                      </button>

                      {!req.isFinalized && req.employeeId === currentUser.id && (
                        <button
                          onClick={() => handleCancel(req.id)}
                          className="btn-danger"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.775rem' }}
                          title="Cancel Request"
                        >
                          <XCircle size={14} /> Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details & Approval Timeline Modal */}
      {activeModalRequest && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModalRequest(null)}
          title={`Leave Request: ${activeModalRequest.id}`}
          subtitle={`Submitted on ${new Date(activeModalRequest.submittedDate).toLocaleDateString()}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Header info */}
            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem'
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Employee</span>
                <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{activeModalRequest.employeeName}</p>
                <p style={{ fontSize: '0.75rem' }}>{activeModalRequest.department}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Leave Type &amp; Days</span>
                <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{activeModalRequest.leaveType}</p>
                <p style={{ fontSize: '0.75rem' }}>{activeModalRequest.leaveDays} days total</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Duration Period</span>
                <p style={{ fontWeight: 500, fontSize: '0.8125rem' }}>
                  {activeModalRequest.startDate} → {activeModalRequest.endDate}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current Status</span>
                <div style={{ marginTop: '0.2rem' }}>
                  <StatusBadge status={activeModalRequest.status} />
                </div>
              </div>
            </div>

            {/* Reason */}
            <div>
              <h4 style={{ fontSize: '0.875rem', marginBottom: '0.35rem' }}>Reason for Time Off</h4>
              <p
                style={{
                  fontSize: '0.875rem',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem'
                }}
              >
                {activeModalRequest.reason}
              </p>
            </div>

            {/* Comments & History */}
            {(activeModalRequest.managerComments || activeModalRequest.hrComments || activeModalRequest.rejectionReason) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h4 style={{ fontSize: '0.875rem' }}>Reviewer Remarks</h4>
                {activeModalRequest.managerComments && (
                  <div style={{ fontSize: '0.8125rem', padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                    <strong>Manager:</strong> {activeModalRequest.managerComments}
                  </div>
                )}
                {activeModalRequest.hrComments && (
                  <div style={{ fontSize: '0.8125rem', padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                    <strong>HR Specialist:</strong> {activeModalRequest.hrComments}
                  </div>
                )}
                {activeModalRequest.rejectionReason && (
                  <div style={{ fontSize: '0.8125rem', padding: '0.5rem 0.75rem', backgroundColor: 'var(--error-subtle)', color: 'var(--error)', borderRadius: 'var(--radius-sm)' }}>
                    <strong>Rejection Justification:</strong> {activeModalRequest.rejectionReason}
                  </div>
                )}
              </div>
            )}

            {/* Visual Timeline */}
            <div>
              <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Approval Workflow Lifecycle</h4>
              <ApprovalTimeline request={activeModalRequest} />
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              <button onClick={() => setActiveModalRequest(null)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
