import React, { useState, useMemo } from 'react';
import { useLeave } from '../context/LeaveContext';
import { StatusBadge } from '../components/StatusBadge';
import {
  FileText,
  Download
} from 'lucide-react';

interface ReportsPageProps {
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ onShowToast }) => {
  const { leaveRequests } = useLeave();

  const [activeReport, setActiveReport] = useState<string>('RPT_All_Leave_Requests');

  const reports = [
    { id: 'RPT_All_Leave_Requests', name: 'All Leave Requests', desc: 'Complete master log of all leave applications across the organization.' },
    { id: 'RPT_Pending_Approvals', name: 'Pending Approvals', desc: 'Requests currently held at Manager, HR, or Final Approver review tiers.' },
    { id: 'RPT_Approved_Leaves', name: 'Approved Leaves YTD', desc: 'All finalized and approved employee leave records.' },
    { id: 'RPT_Rejected_Leaves', name: 'Rejected Leaves', desc: 'Summary of rejected leave applications with justifications.' },
    { id: 'RPT_Department_Leave_Analysis', name: 'Department Analysis', desc: 'Aggregated leave consumption by organizational unit.' },
    { id: 'RPT_Leave_Type_Analysis', name: 'Leave Type Breakdown', desc: 'Distribution across Casual, Sick, Earned, and Unpaid leave.' },
    { id: 'RPT_Monthly_Leave_Trends', name: 'Monthly Trends', desc: 'Time series of leave submission volume and approval velocity.' }
  ];

  const currentReportMeta = reports.find(r => r.id === activeReport) || reports[0];

  // Report Data computation
  const filteredData = useMemo(() => {
    switch (activeReport) {
      case 'RPT_Pending_Approvals':
        return leaveRequests.filter(r => !r.isFinalized);
      case 'RPT_Approved_Leaves':
        return leaveRequests.filter(r => r.status === 'Final Approved');
      case 'RPT_Rejected_Leaves':
        return leaveRequests.filter(r => r.status === 'Rejected');
      case 'RPT_Department_Leave_Analysis':
      case 'RPT_Leave_Type_Analysis':
      case 'RPT_Monthly_Leave_Trends':
      case 'RPT_All_Leave_Requests':
      default:
        return leaveRequests;
    }
  }, [activeReport, leaveRequests]);

  const handleExportCSV = () => {
    const headers = ['Request ID', 'Employee Name', 'Department', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Current Tier', 'Reason'];
    const rows = filteredData.map(r => [
      r.id,
      `"${r.employeeName}"`,
      r.department,
      r.leaveType,
      r.startDate,
      r.endDate,
      r.leaveDays,
      r.status,
      r.approvalLevel,
      `"${r.reason.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeReport}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast('success', `Exported ${filteredData.length} records to ${activeReport}.csv`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Reports &amp; Analytics</h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Built to match standard Salesforce DX Report metadata specifications.
          </p>
        </div>

        <button onClick={handleExportCSV} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Download size={16} /> Export to CSV
        </button>
      </div>

      {/* Report Selector Pills */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        {reports.map(rep => (
          <button
            key={rep.id}
            onClick={() => setActiveReport(rep.id)}
            style={{
              padding: '0.5rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              fontWeight: activeReport === rep.id ? 600 : 500,
              backgroundColor: activeReport === rep.id ? 'var(--accent-subtle)' : 'var(--bg-surface)',
              color: activeReport === rep.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
              border: `1px solid ${activeReport === rep.id ? 'rgba(201, 111, 91, 0.4)' : 'var(--border-subtle)'}`,
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <FileText size={14} />
            {rep.name}
          </button>
        ))}
      </div>

      {/* Active Report Header Card */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', backgroundColor: 'var(--accent-subtle)', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-sm)' }}>
                {currentReportMeta.id}
              </span>
              <h3 style={{ fontSize: '1.125rem' }}>{currentReportMeta.name}</h3>
            </div>
            <p style={{ fontSize: '0.8125rem', marginTop: '0.2rem' }}>{currentReportMeta.desc}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{filteredData.length}</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}> records matched</span>
          </div>
        </div>
      </div>

      {/* Report Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Employee</th>
              <th>Department</th>
              <th>Leave Type</th>
              <th>Date Range</th>
              <th>Days</th>
              <th>Status</th>
              <th>Review Tier</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(req => (
              <tr key={req.id}>
                <td style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{req.id}</td>
                <td style={{ fontWeight: 500 }}>{req.employeeName}</td>
                <td>{req.department}</td>
                <td>{req.leaveType}</td>
                <td style={{ fontSize: '0.8125rem' }}>{req.startDate} → {req.endDate}</td>
                <td><strong>{req.leaveDays}</strong> days</td>
                <td><StatusBadge status={req.status} size="sm" /></td>
                <td>{req.approvalLevel === 'None' ? 'Finalized' : req.approvalLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
