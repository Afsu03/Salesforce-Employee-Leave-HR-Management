import React, { useState, useMemo } from 'react';
import { useLeave } from '../context/LeaveContext';
import { LeaveRequest } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ApprovalTimeline } from '../components/ApprovalTimeline';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import {
  CheckSquare,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface ApprovalCenterPageProps {
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const ApprovalCenterPage: React.FC<ApprovalCenterPageProps> = ({ onShowToast }) => {
  const { leaveRequests, approveLeaveRequest, rejectLeaveRequest } = useLeave();

  const [activeTab, setActiveTab] = useState<'Pending' | 'Processed'>('Pending');
  const [selectedQueue, setSelectedQueue] = useState<'All' | 'Manager' | 'HR' | 'Final Approver'>('All');

  const [approveModalRequest, setApproveModalRequest] = useState<LeaveRequest | null>(null);
  const [rejectModalRequest, setRejectModalRequest] = useState<LeaveRequest | null>(null);
  const [approvalComments, setApprovalComments] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  // Pending queue
  const pendingRequests = useMemo(() => {
    return leaveRequests.filter(r => {
      if (r.isFinalized) return false;
      if (selectedQueue === 'All') return true;
      return r.approvalLevel === selectedQueue;
    });
  }, [leaveRequests, selectedQueue]);

  // Processed requests
  const processedRequests = useMemo(() => {
    return leaveRequests.filter(r => r.isFinalized);
  }, [leaveRequests]);

  const handleApproveConfirm = () => {
    if (!approveModalRequest) return;
    const result = approveLeaveRequest(approveModalRequest.id, approvalComments);
    if (result.success) {
      onShowToast('success', result.message);
      setApproveModalRequest(null);
      setApprovalComments('');
    } else {
      onShowToast('error', result.message);
    }
  };

  const handleRejectConfirm = () => {
    if (!rejectModalRequest) return;
    if (!rejectionReason.trim()) {
      onShowToast('error', 'Please enter a rejection reason.');
      return;
    }
    const result = rejectLeaveRequest(rejectModalRequest.id, rejectionReason);
    if (result.success) {
      onShowToast('info', result.message);
      setRejectModalRequest(null);
      setRejectionReason('');
    } else {
      onShowToast('error', result.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Approval Center</h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Declarative multi-stage approval queue for Team Managers, HR Specialists, and Department Heads.
        </p>
      </div>

      {/* Notice Banner explaining conditional routing logic */}
      <div
        style={{
          padding: '1rem 1.25rem',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          gap: '0.85rem',
          alignItems: 'flex-start'
        }}
      >
        <ShieldCheck size={20} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--text-primary)' }}>Salesforce Declarative Routing Policy:</strong>
          <span style={{ marginLeft: '0.35rem' }}>
            <strong>1–2 days:</strong> Direct Manager approval finalizes request &amp; updates leave balance.&nbsp;•&nbsp;
            <strong>3–5 days:</strong> Manager → HR review required.&nbsp;•&nbsp;
            <strong>&gt;5 days:</strong> Manager → HR → Final Approver (VP/Director).
          </span>
        </div>
      </div>

      {/* Tabs & Queue Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', width: '100%', paddingBottom: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('Pending')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.875rem',
              backgroundColor: activeTab === 'Pending' ? 'var(--accent-subtle)' : 'transparent',
              color: activeTab === 'Pending' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Clock size={16} /> Pending Queue ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('Processed')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.875rem',
              backgroundColor: activeTab === 'Processed' ? 'var(--accent-subtle)' : 'transparent',
              color: activeTab === 'Processed' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <CheckSquare size={16} /> Finalized Decisions ({processedRequests.length})
          </button>
        </div>
      </div>

      {activeTab === 'Pending' ? (
        <>
          {/* Pending Queue Level Filters */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {(['All', 'Manager', 'HR', 'Final Approver'] as const).map(tier => (
              <button
                key={tier}
                onClick={() => setSelectedQueue(tier)}
                style={{
                  padding: '0.35rem 0.8rem',
                  fontSize: '0.8125rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: selectedQueue === tier ? 'var(--accent-primary)' : 'var(--bg-surface)',
                  color: selectedQueue === tier ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: selectedQueue === tier ? 600 : 400
                }}
              >
                {tier === 'All' ? 'All Tiers' : `${tier} Queue`}
              </button>
            ))}
          </div>

          {/* Pending List */}
          {pendingRequests.length === 0 ? (
            <EmptyState
              title="You're all caught up."
              description="No pending leave requests requiring review in this queue at the moment."
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pendingRequests.map(req => {
                return (
                  <div
                    key={req.id}
                    className="card card-hover"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      padding: '1.5rem',
                      borderLeft: '4px solid var(--accent-primary)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {req.employeeName}
                          </span>
                          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>• {req.department}</span>
                          <StatusBadge status={req.status} size="sm" />
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                          Applied on {new Date(req.submittedDate).toLocaleDateString()} &nbsp;•&nbsp; Request ID: <strong>{req.id}</strong>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '0.65rem' }}>
                        <button
                          onClick={() => {
                            setRejectModalRequest(req);
                            setRejectionReason('');
                          }}
                          className="btn-danger"
                          style={{ padding: '0.5rem 0.9rem', fontSize: '0.8125rem' }}
                        >
                          <XCircle size={15} /> Reject
                        </button>
                        <button
                          onClick={() => {
                            setApproveModalRequest(req);
                            setApprovalComments('');
                          }}
                          className="btn-success"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}
                        >
                          <CheckCircle size={15} /> Approve
                        </button>
                      </div>
                    </div>

                    {/* Details Box */}
                    <div
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1rem',
                        fontSize: '0.8125rem'
                      }}
                    >
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Leave Type</span>
                        <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{req.leaveType}</p>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Duration</span>
                        <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {req.startDate} → {req.endDate} ({req.leaveDays} {req.leaveDays === 1 ? 'day' : 'days'})
                        </p>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Current Review Tier</span>
                        <p style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>
                          {req.approvalLevel} Tier
                        </p>
                      </div>
                    </div>

                    {/* Reason */}
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Reason:</span>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginTop: '0.2rem' }}>{req.reason}</p>
                    </div>

                    {/* Previous comments if any */}
                    {req.managerComments && (
                      <div style={{ fontSize: '0.8125rem', padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                        <strong>Manager Endorsement:</strong> {req.managerComments}
                      </div>
                    )}

                    {/* Embedded timeline */}
                    <ApprovalTimeline request={req} compact={true} />
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* Processed / Finalized Archive */
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Employee</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Decision Status</th>
                <th>Approved / Final Date</th>
                <th>Final Remarks</th>
              </tr>
            </thead>
            <tbody>
              {processedRequests.map(req => (
                <tr key={req.id}>
                  <td style={{ fontWeight: 600 }}>{req.id}</td>
                  <td>{req.employeeName}</td>
                  <td>{req.leaveType}</td>
                  <td>{req.leaveDays} days ({req.startDate} to {req.endDate})</td>
                  <td><StatusBadge status={req.status} size="sm" /></td>
                  <td style={{ fontSize: '0.8125rem' }}>{req.approvedDate ? new Date(req.approvedDate).toLocaleDateString() : '—'}</td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', maxWidth: 220 }}>
                    {req.rejectionReason ? `Reason: ${req.rejectionReason}` : req.finalApprovalComments || req.managerComments || 'Fully finalized'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {approveModalRequest && (
        <Modal
          isOpen={true}
          onClose={() => setApproveModalRequest(null)}
          title={`Approve Leave Request: ${approveModalRequest.id}`}
          subtitle={`Reviewing ${approveModalRequest.employeeName}'s ${approveModalRequest.leaveDays}-day ${approveModalRequest.leaveType} request`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ padding: '0.85rem', backgroundColor: 'var(--success-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: '#2E5830' }}>
              ✓ Approving this request will advance it to the next tier or finalize it according to Salesforce routing criteria.
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                Reviewer Comments (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Workload covered. Handover completed."
                value={approvalComments}
                onChange={e => setApprovalComments(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setApproveModalRequest(null)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleApproveConfirm} className="btn-success">
                Confirm Approval
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Confirmation Modal */}
      {rejectModalRequest && (
        <Modal
          isOpen={true}
          onClose={() => setRejectModalRequest(null)}
          title={`Reject Leave Request: ${rejectModalRequest.id}`}
          subtitle={`Rejecting ${rejectModalRequest.employeeName}'s request`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ padding: '0.85rem', backgroundColor: 'var(--error-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: '#8C2E2E' }}>
              ⚠️ Rejection will lock the request, notify the employee, and avoid deducting any leave quota.
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                Rejection Reason (Required)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Critical release scheduled during this period; please reschedule."
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setRejectModalRequest(null)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleRejectConfirm} className="btn-danger">
                Confirm Rejection
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
