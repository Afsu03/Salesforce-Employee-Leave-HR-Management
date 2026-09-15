import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee, LeaveRequest, LeaveType, NotificationItem, UserRole } from '../types';
import { INITIAL_EMPLOYEES, INITIAL_LEAVE_REQUESTS, INITIAL_NOTIFICATIONS } from '../data/mockData';

interface SubmitRequestParams {
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}

interface LeaveContextType {
  employees: Employee[];
  currentUser: Employee;
  userRole: UserRole;
  leaveRequests: LeaveRequest[];
  notifications: NotificationItem[];
  setCurrentUser: (emp: Employee) => void;
  setUserRole: (role: UserRole) => void;
  submitLeaveRequest: (params: SubmitRequestParams) => { success: boolean; message: string; request?: LeaveRequest };
  approveLeaveRequest: (requestId: string, comments?: string) => { success: boolean; message: string };
  rejectLeaveRequest: (requestId: string, reason: string) => { success: boolean; message: string };
  cancelLeaveRequest: (requestId: string) => { success: boolean; message: string };
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;
}

const LeaveContext = createContext<LeaveContextType | undefined>(undefined);

const STORAGE_KEY_REQUESTS = 'sf_leave_requests_v1';
const STORAGE_KEY_EMPLOYEES = 'sf_employees_v1';
const STORAGE_KEY_USER = 'sf_current_user_v1';
const STORAGE_KEY_ROLE = 'sf_current_role_v1';

export const LeaveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_EMPLOYEES);
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [currentUser, setCurrentUserState] = useState<Employee>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_EMPLOYEES[0];
  });

  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ROLE);
    return (saved as UserRole) || 'Employee';
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_REQUESTS);
    return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EMPLOYEES, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ROLE, userRole);
  }, [userRole]);

  const setCurrentUser = (emp: Employee) => {
    setCurrentUserState(emp);
  };

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
  };

  const calculateDays = (start: string, end: string): number => {
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime()) || e < s) return 0;
    const diffTime = Math.abs(e.getTime() - s.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const deductLeaveBalance = (employeeId: string, leaveType: LeaveType, days: number) => {
    if (leaveType === 'Unpaid Leave' || leaveType === 'Emergency Leave') {
      return;
    }

    setEmployees(prev =>
      prev.map(emp => {
        if (emp.id !== employeeId) return emp;

        let updated = { ...emp };
        if (leaveType === 'Casual Leave') {
          const used = emp.usedCasualLeave + days;
          updated.usedCasualLeave = used;
          updated.remainingCasualLeave = Math.max(0, emp.totalCasualLeave - used);
        } else if (leaveType === 'Sick Leave') {
          const used = emp.usedSickLeave + days;
          updated.usedSickLeave = used;
          updated.remainingSickLeave = Math.max(0, emp.totalSickLeave - used);
        } else if (leaveType === 'Earned Leave') {
          const used = emp.usedEarnedLeave + days;
          updated.usedEarnedLeave = used;
          updated.remainingEarnedLeave = Math.max(0, emp.totalEarnedLeave - used);
        }

        if (currentUser.id === emp.id) {
          setCurrentUserState(updated);
        }

        return updated;
      })
    );
  };

  const submitLeaveRequest = (params: SubmitRequestParams) => {
    const employee = employees.find(e => e.id === params.employeeId) || currentUser;
    const days = calculateDays(params.startDate, params.endDate);

    if (days <= 0) {
      return { success: false, message: 'End date cannot be earlier than start date.' };
    }

    if (!params.reason.trim()) {
      return { success: false, message: 'Please provide a reason for your leave request.' };
    }

    // Check balance
    if (params.leaveType === 'Casual Leave' && days > employee.remainingCasualLeave) {
      return { success: false, message: `Insufficient casual leave balance (${employee.remainingCasualLeave} days remaining, requested ${days} days).` };
    }
    if (params.leaveType === 'Sick Leave' && days > employee.remainingSickLeave) {
      return { success: false, message: `Insufficient sick leave balance (${employee.remainingSickLeave} days remaining, requested ${days} days).` };
    }
    if (params.leaveType === 'Earned Leave' && days > employee.remainingEarnedLeave) {
      return { success: false, message: `Insufficient earned leave balance (${employee.remainingEarnedLeave} days remaining, requested ${days} days).` };
    }

    // Generate AutoNumber format LR-00108...
    const count = leaveRequests.length + 101;
    const newId = `LR-${String(count).padStart(5, '0')}`;

    const newRequest: LeaveRequest = {
      id: newId,
      employeeId: employee.id,
      employeeName: employee.name,
      department: employee.department,
      leaveType: params.leaveType,
      startDate: params.startDate,
      endDate: params.endDate,
      leaveDays: days,
      reason: params.reason,
      status: 'Submitted',
      approvalLevel: 'Manager',
      submittedDate: new Date().toISOString(),
      isFinalized: false
    };

    setLeaveRequests(prev => [newRequest, ...prev]);

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Leave Request Submitted',
      message: `Request ${newId} for ${days} days ${params.leaveType} submitted for Manager review.`,
      timestamp: 'Just now',
      read: false,
      type: 'info',
      requestId: newId
    };
    setNotifications(prev => [newNotif, ...prev]);

    return { success: true, message: `Leave request ${newId} submitted successfully!`, request: newRequest };
  };

  const approveLeaveRequest = (requestId: string, comments?: string) => {
    const target = leaveRequests.find(r => r.id === requestId);
    if (!target) return { success: false, message: 'Request not found.' };
    if (target.isFinalized) return { success: false, message: 'This request has already been finalized.' };

    let newStatus: LeaveRequest['status'] = target.status;
    let newLevel: LeaveRequest['approvalLevel'] = target.approvalLevel;
    let approvedDate: string | undefined = undefined;
    let isFinalized = false;
    let notificationMsg = '';

    // Declarative Salesforce Routing Matrix:
    // Stage 1: Submitted (Manager review)
    if (target.status === 'Submitted') {
      if (target.leaveDays <= 2) {
        // 1-2 days: Auto promote directly to Final Approved
        newStatus = 'Final Approved';
        newLevel = 'None';
        approvedDate = new Date().toISOString();
        isFinalized = true;
        deductLeaveBalance(target.employeeId, target.leaveType, target.leaveDays);
        notificationMsg = `Leave request ${target.id} has been fully approved by Manager (${target.leaveDays} days deducted).`;
      } else {
        // 3+ days: Route to HR
        newStatus = 'Manager Approved';
        newLevel = 'HR';
        notificationMsg = `Manager approved request ${target.id}. Now awaiting HR Review.`;
      }
    }
    // Stage 2: Manager Approved (HR review)
    else if (target.status === 'Manager Approved') {
      if (target.leaveDays <= 5) {
        // 3-5 days: HR approval finalizes request
        newStatus = 'Final Approved';
        newLevel = 'None';
        approvedDate = new Date().toISOString();
        isFinalized = true;
        deductLeaveBalance(target.employeeId, target.leaveType, target.leaveDays);
        notificationMsg = `HR approved request ${target.id}. Fully finalized (${target.leaveDays} days deducted).`;
      } else {
        // >5 days: Route to Final Approver (Director / VP)
        newStatus = 'HR Approved';
        newLevel = 'Final Approver';
        notificationMsg = `HR endorsed request ${target.id}. Routed to Final Approver (Duration > 5 days).`;
      }
    }
    // Stage 3: HR Approved (Final Approver tier)
    else if (target.status === 'HR Approved') {
      newStatus = 'Final Approved';
      newLevel = 'None';
      approvedDate = new Date().toISOString();
      isFinalized = true;
      deductLeaveBalance(target.employeeId, target.leaveType, target.leaveDays);
      notificationMsg = `Final approval granted for request ${target.id} (${target.leaveDays} days deducted).`;
    }

    setLeaveRequests(prev =>
      prev.map(r => {
        if (r.id !== requestId) return r;
        return {
          ...r,
          status: newStatus,
          approvalLevel: newLevel,
          approvedDate: approvedDate || r.approvedDate,
          isFinalized,
          managerComments: target.status === 'Submitted' ? comments || r.managerComments : r.managerComments,
          hrComments: target.status === 'Manager Approved' ? comments || r.hrComments : r.hrComments,
          finalApprovalComments: target.status === 'HR Approved' ? comments || r.finalApprovalComments : r.finalApprovalComments
        };
      })
    );

    // Notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Approval Update',
      message: notificationMsg,
      timestamp: 'Just now',
      read: false,
      type: isFinalized ? 'success' : 'info',
      requestId: target.id
    };
    setNotifications(prev => [newNotif, ...prev]);

    return { success: true, message: notificationMsg };
  };

  const rejectLeaveRequest = (requestId: string, reason: string) => {
    const target = leaveRequests.find(r => r.id === requestId);
    if (!target) return { success: false, message: 'Request not found.' };
    if (target.isFinalized) return { success: false, message: 'This request has already been finalized.' };
    if (!reason.trim()) return { success: false, message: 'Please provide a reason for rejection.' };

    setLeaveRequests(prev =>
      prev.map(r => {
        if (r.id !== requestId) return r;
        return {
          ...r,
          status: 'Rejected',
          approvalLevel: 'None',
          rejectionReason: reason,
          isFinalized: true
        };
      })
    );

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Leave Request Rejected',
      message: `Request ${target.id} was rejected. Reason: ${reason}`,
      timestamp: 'Just now',
      read: false,
      type: 'alert',
      requestId: target.id
    };
    setNotifications(prev => [newNotif, ...prev]);

    return { success: true, message: `Request ${target.id} rejected.` };
  };

  const cancelLeaveRequest = (requestId: string) => {
    const target = leaveRequests.find(r => r.id === requestId);
    if (!target) return { success: false, message: 'Request not found.' };
    if (target.isFinalized) return { success: false, message: 'Cannot cancel a finalized request.' };

    setLeaveRequests(prev =>
      prev.map(r => {
        if (r.id !== requestId) return r;
        return {
          ...r,
          status: 'Cancelled',
          approvalLevel: 'None',
          isFinalized: true
        };
      })
    );

    return { success: true, message: `Leave request ${target.id} cancelled.` };
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY_EMPLOYEES);
    localStorage.removeItem(STORAGE_KEY_REQUESTS);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_ROLE);
    setEmployees(INITIAL_EMPLOYEES);
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    setCurrentUserState(INITIAL_EMPLOYEES[0]);
    setUserRoleState('Employee');
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  return (
    <LeaveContext.Provider
      value={{
        employees,
        currentUser,
        userRole,
        leaveRequests,
        notifications,
        setCurrentUser,
        setUserRole,
        submitLeaveRequest,
        approveLeaveRequest,
        rejectLeaveRequest,
        cancelLeaveRequest,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData
      }}
    >
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeave = () => {
  const context = useContext(LeaveContext);
  if (!context) throw new Error('useLeave must be used within a LeaveProvider');
  return context;
};
