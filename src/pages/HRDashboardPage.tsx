import React from 'react';
import { useLeave } from '../context/LeaveContext';
import { MetricCard } from '../components/MetricCard';
import { Users, Clock, CheckCircle2, Building2 } from 'lucide-react';

interface HRDashboardPageProps {
  onNavigate?: (page: string) => void;
}

export const HRDashboardPage: React.FC<HRDashboardPageProps> = () => {
  const { employees, leaveRequests } = useLeave();

  const totalEmployees = employees.length;
  const pendingRequests = leaveRequests.filter(r => !r.isFinalized);
  const approvedRequests = leaveRequests.filter(r => r.status === 'Final Approved');
  const totalDaysTakenYTD = approvedRequests.reduce((acc, r) => acc + r.leaveDays, 0);

  // Department counts
  const deptMap: Record<string, { total: number; days: number }> = {};
  leaveRequests.forEach(r => {
    if (!deptMap[r.department]) {
      deptMap[r.department] = { total: 0, days: 0 };
    }
    deptMap[r.department].total += 1;
    if (r.status === 'Final Approved') {
      deptMap[r.department].days += r.leaveDays;
    }
  });

  // Leave type counts
  const typeMap: Record<string, number> = {
    'Casual Leave': 0,
    'Sick Leave': 0,
    'Earned Leave': 0,
    'Emergency Leave': 0,
    'Unpaid Leave': 0
  };
  leaveRequests.forEach(r => {
    if (typeMap[r.leaveType] !== undefined) {
      typeMap[r.leaveType] += 1;
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Heading */}
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>HR Management &amp; Analytics</h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Workforce attendance overview, department leave quotas, and employee directories.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid-4">
        <MetricCard
          label="Total Headcount"
          value={totalEmployees}
          subtext="Active employee profiles"
          icon={<Users size={20} />}
          variant="default"
        />
        <MetricCard
          label="Pending Approvals"
          value={pendingRequests.length}
          subtext="Across all review tiers"
          icon={<Clock size={20} />}
          variant="warning"
        />
        <MetricCard
          label="Approved Requests"
          value={approvedRequests.length}
          subtext="Finalized leave requests"
          icon={<CheckCircle2 size={20} />}
          variant="success"
        />
        <MetricCard
          label="Days Taken YTD"
          value={`${totalDaysTakenYTD} days`}
          subtext="Total workforce time off"
          icon={<Building2 size={20} />}
          variant="accent"
        />
      </div>

      {/* Visual Analysis Grid */}
      <div className="grid-2">
        {/* Department Analysis */}
        <div className="card">
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>Leave by Department</h3>
          <p style={{ fontSize: '0.8125rem', marginBottom: '1.25rem' }}>Distribution of finalized leave days across business units</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(deptMap).map(([dept, data]) => {
              const maxDays = Math.max(...Object.values(deptMap).map(d => d.days), 10);
              const pct = Math.round((data.days / maxDays) * 100);

              return (
                <div key={dept}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600 }}>{dept}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      <strong>{data.days}</strong> days taken ({data.total} requests)
                    </span>
                  </div>
                  <div style={{ height: 8, width: '100%', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        backgroundColor: 'var(--accent-primary)',
                        borderRadius: 'var(--radius-full)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leave Type Breakdown */}
        <div className="card">
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>Leave by Category</h3>
          <p style={{ fontSize: '0.8125rem', marginBottom: '1.25rem' }}>Proportion of leave types requested</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {Object.entries(typeMap).map(([type, count]) => {
              const totalReqs = leaveRequests.length || 1;
              const pct = Math.round((count / totalReqs) * 100);

              const getColor = (t: string) => {
                if (t === 'Casual Leave') return 'var(--accent-primary)';
                if (t === 'Sick Leave') return 'var(--success)';
                if (t === 'Earned Leave') return 'var(--warning)';
                return 'var(--text-secondary)';
              };

              return (
                <div key={type} style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: getColor(type) }} />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{type}</span>
                    </div>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      <strong>{count}</strong> ({pct}%)
                    </span>
                  </div>
                  <div style={{ height: 5, width: '100%', backgroundColor: 'var(--border-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, backgroundColor: getColor(type), borderRadius: 'var(--radius-full)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Employee Directory with Leave Balances */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem' }}>Employee Directory &amp; Leave Quotas</h3>
            <p style={{ fontSize: '0.8125rem' }}>Live sync with Salesforce Employee__c custom object records</p>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Casual Leave (Rem/Tot)</th>
                <th>Sick Leave (Rem/Tot)</th>
                <th>Earned Leave (Rem/Tot)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{emp.employeeId}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{emp.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.email}</div>
                  </td>
                  <td>{emp.department}</td>
                  <td>{emp.designation}</td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{emp.remainingCasualLeave}</span> / {emp.totalCasualLeave}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{emp.remainingSickLeave}</span> / {emp.totalSickLeave}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{emp.remainingEarnedLeave}</span> / {emp.totalEarnedLeave}
                  </td>
                  <td>
                    <span className="badge badge-final-approved" style={{ fontSize: '0.75rem' }}>
                      {emp.employmentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
