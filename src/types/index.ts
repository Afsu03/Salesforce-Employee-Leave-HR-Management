export type Department = 'Engineering' | 'HR' | 'Finance' | 'Marketing' | 'Sales' | 'Operations';

export type EmploymentStatus = 'Active' | 'On Leave' | 'Resigned' | 'Terminated';

export type LeaveType = 'Casual Leave' | 'Sick Leave' | 'Earned Leave' | 'Emergency Leave' | 'Unpaid Leave';

export type LeaveStatus = 'Draft' | 'Submitted' | 'Manager Approved' | 'HR Approved' | 'Final Approved' | 'Rejected' | 'Cancelled';

export type ApprovalLevel = 'Manager' | 'HR' | 'Final Approver' | 'None';

export type UserRole = 'Employee' | 'Manager' | 'HR';

export interface Employee {
  id: string; // SF record ID or EMP-1001
  employeeId: string;
  name: string;
  email: string;
  department: Department;
  designation: string;
  managerId?: string;
  managerName?: string;
  joiningDate: string;
  employmentStatus: EmploymentStatus;
  avatarUrl?: string;
  // Leave quotas
  totalCasualLeave: number;
  usedCasualLeave: number;
  remainingCasualLeave: number;
  totalSickLeave: number;
  usedSickLeave: number;
  remainingSickLeave: number;
  totalEarnedLeave: number;
  usedEarnedLeave: number;
  remainingEarnedLeave: number;
}

export interface LeaveRequest {
  id: string; // e.g. LR-00101
  employeeId: string;
  employeeName: string;
  department: Department;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  leaveDays: number;
  reason: string;
  status: LeaveStatus;
  approvalLevel: ApprovalLevel;
  submittedDate: string;
  approvedDate?: string;
  managerComments?: string;
  hrComments?: string;
  finalApprovalComments?: string;
  rejectionReason?: string;
  isFinalized: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
  requestId?: string;
}
