import React, { useState } from 'react';
import { useLeave } from '../context/LeaveContext';
import { UserRole } from '../types';
import {
  RotateCcw,
  Code2,
  Users,
  CheckCircle2,
  Database,
  GitBranch,
  Layers
} from 'lucide-react';

interface SettingsPageProps {
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onShowToast }) => {
  const {
    employees,
    currentUser,
    setCurrentUser,
    userRole,
    setUserRole,
    resetDemoData
  } = useLeave();

  const [activeTab, setActiveTab] = useState<'Personas' | 'Architecture' | 'SalesforceDX'>('Personas');

  const handleReset = () => {
    if (window.confirm('Reset all demo data and leave balances to their initial state?')) {
      resetDemoData();
      onShowToast('info', 'Demo data has been reset to initial state.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Settings &amp; Architecture</h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Switch personas, configure demo roles, or inspect underlying Salesforce DX metadata.
          </p>
        </div>

        <button onClick={handleReset} className="btn-secondary" style={{ color: 'var(--error)', borderColor: 'rgba(184, 92, 92, 0.3)' }}>
          <RotateCcw size={16} /> Reset Demo Data
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('Personas')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: '0.875rem',
            backgroundColor: activeTab === 'Personas' ? 'var(--accent-subtle)' : 'transparent',
            color: activeTab === 'Personas' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Users size={16} /> Persona &amp; Role Switcher
        </button>
        <button
          onClick={() => setActiveTab('Architecture')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: '0.875rem',
            backgroundColor: activeTab === 'Architecture' ? 'var(--accent-subtle)' : 'transparent',
            color: activeTab === 'Architecture' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Layers size={16} /> Two-Layer Architecture
        </button>
        <button
          onClick={() => setActiveTab('SalesforceDX')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: '0.875rem',
            backgroundColor: activeTab === 'SalesforceDX' ? 'var(--accent-subtle)' : 'transparent',
            color: activeTab === 'SalesforceDX' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Code2 size={16} /> Salesforce DX Metadata
        </button>
      </div>

      {activeTab === 'Personas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Active Role Configuration */}
          <div className="card">
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>Simulated Security Role</h3>
            <p style={{ fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
              Switch between Salesforce Permission Set perspectives (PS_Employee, PS_Manager, PS_HR).
            </p>

            <div className="grid-3">
              {(['Employee', 'Manager', 'HR'] as UserRole[]).map(r => (
                <div
                  key={r}
                  onClick={() => {
                    setUserRole(r);
                    onShowToast('info', `Active role switched to ${r}`);
                  }}
                  className={`card card-hover`}
                  style={{
                    cursor: 'pointer',
                    borderColor: userRole === r ? 'var(--accent-primary)' : 'var(--border-subtle)',
                    backgroundColor: userRole === r ? 'var(--accent-subtle)' : 'var(--bg-surface)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{r} Perspective</h4>
                    {userRole === r && <CheckCircle2 size={18} color="var(--accent-primary)" />}
                  </div>
                  <p style={{ fontSize: '0.8125rem', marginTop: '0.5rem' }}>
                    {r === 'Employee' && 'Self-service dashboard, apply for leave, track quotas.'}
                    {r === 'Manager' && 'Review direct report requests, approve 1-2 day fast-track leaves.'}
                    {r === 'HR' && 'Full workforce visibility, endorse multi-day leaves, audit reports.'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Persona Picker */}
          <div className="card">
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>Available Employee Personas</h3>
            <p style={{ fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
              Select an employee persona to simulate their perspective, manager relationship, and quota.
            </p>

            <div className="grid-2">
              {employees.map(emp => (
                <div
                  key={emp.id}
                  onClick={() => {
                    setCurrentUser(emp);
                    onShowToast('info', `Logged in as ${emp.name}`);
                  }}
                  className="card card-hover"
                  style={{
                    cursor: 'pointer',
                    borderColor: currentUser.id === emp.id ? 'var(--accent-primary)' : 'var(--border-subtle)',
                    backgroundColor: currentUser.id === emp.id ? 'var(--accent-subtle)' : 'var(--bg-surface)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{emp.name}</h4>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 500 }}>
                        {emp.designation} &nbsp;•&nbsp; {emp.department}
                      </p>
                    </div>
                    {currentUser.id === emp.id && (
                      <span className="badge badge-final-approved" style={{ fontSize: '0.725rem' }}>
                        Active Persona
                      </span>
                    )}
                  </div>

                  <div style={{ marginTop: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    <div><strong>Email:</strong> {emp.email}</div>
                    <div><strong>ID:</strong> {emp.employeeId} &nbsp;•&nbsp; <strong>Status:</strong> {emp.employmentStatus}</div>
                    <div style={{ marginTop: '0.4rem', color: 'var(--text-primary)' }}>
                      <strong>Remaining Quota:</strong> Casual: {emp.remainingCasualLeave} | Sick: {emp.remainingSickLeave} | Earned: {emp.remainingEarnedLeave}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Architecture' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Two-Layer Strategy Explained</h3>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
              This repository is architected with two complementary layers to provide both an authentic Salesforce DX backend and an interactive recruiter demo:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', marginTop: '1.25rem' }}>
              <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Database size={20} color="var(--accent-primary)" />
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Layer A — Real Salesforce Metadata</h4>
                </div>
                <p style={{ fontSize: '0.8125rem', lineHeight: 1.5 }}>
                  The source of truth in <code>force-app/main/default/</code>. Contains custom objects (<code>Employee__c</code>, <code>Leave_Request__c</code>), formula fields, validation rules, screen flows, record-triggered flows, permission sets, reports, and dashboards. 100% declarative Salesforce automation.
                </p>
              </div>

              <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <GitBranch size={20} color="var(--success)" />
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Layer B — Portfolio Demo Experience</h4>
                </div>
                <p style={{ fontSize: '0.8125rem', lineHeight: 1.5 }}>
                  A lightweight React + Vite interface simulating the employee self-service dashboard, multi-level approval timelines, live leave balance deductions, and HR analytics. Clearly documented as a visual presentation layer for hiring managers.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'SalesforceDX' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>Salesforce Metadata Inventory</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
              <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                <strong>Custom Objects:</strong>
                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.35rem', color: 'var(--text-secondary)' }}>
                  <li><code>Employee__c</code>: Stores employee profiles, manager lookup, and annual Casual/Sick/Earned quotas.</li>
                  <li><code>Leave_Request__c</code>: AutoNumber (LR-{'{00000}'}), dates, duration formula (End - Start + 1), reason, multi-level approval level, status, and comments.</li>
                </ul>
              </div>

              <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                <strong>Declarative Flows:</strong>
                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.35rem', color: 'var(--text-secondary)' }}>
                  <li><code>FLW_Leave_Request_Submission</code>: Screen flow for employee self-service.</li>
                  <li><code>FLW_Leave_Request_Validation</code>: Record-triggered before-insert flow.</li>
                  <li><code>FLW_Leave_Approval_Routing</code>: Record-triggered conditional duration routing (1-2 days, 3-5 days, &gt;5 days).</li>
                  <li><code>FLW_Leave_Balance_Deduction</code>: Record-triggered after-save flow executing balance deduction upon Final Approval.</li>
                </ul>
              </div>

              <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                <strong>Validation Rules:</strong>
                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.35rem', color: 'var(--text-secondary)' }}>
                  <li><code>VR_End_Date_Before_Start_Date</code>: End date &lt; Start date check.</li>
                  <li><code>VR_Reason_Required</code>: Mandatory reason check.</li>
                  <li><code>VR_Employee_Required</code>: Mandatory employee lookup check.</li>
                  <li><code>VR_Prevent_Edit_After_Finalization</code>: Locks finalized records.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
