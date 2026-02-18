import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Umbrella,
  DollarSign,
  FileText,
  Target,
  Settings,
  Shield,
  Building2,
  MapPin,
  Clock,
  ChevronDown,
  ChevronRight,
  UserPlus,
  UserMinus,
  GitBranch,
  BarChart3,
  Upload,
  Menu,
  X
} from 'lucide-react';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

const getDashboardPath = () => {
    try {
        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : {};
        const role = user.role?.toLowerCase();
        
        if (role === 'admin') return '/admin';
        if (role === 'manager') return '/manager';
        if (role === 'employee') return '/employee';
        return '/';
    } catch (e) {
        return '/';
    }
}

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: getDashboardPath()
  },
  {
    label: 'User Management',
    icon: <Users className="w-5 h-5" />,
    children: [
      { label: 'Employees', icon: <Users className="w-4 h-4" />, path: '/employees' },
      { label: 'Management', icon: <Users className="w-4 h-4" />, path: '/management' },
      { label: 'Ex Employees', icon: <UserMinus className="w-4 h-4" />, path: '/ex-employees' },
      { label: 'Employee Onboarding', icon: <UserPlus className="w-4 h-4" />, path: '/onboarding' },
      { label: 'Employee Offboarding', icon: <UserMinus className="w-4 h-4" />, path: '/offboarding' },
      { label: 'Management Role', icon: <Shield className="w-4 h-4" />, path: '/roles' },
      { label: 'Employee Level Assign', icon: <BarChart3 className="w-4 h-4" />, path: '/levels' },
      { label: 'Profile Change Request', icon: <FileText className="w-4 h-4" />, path: '/profile-changes' },
      { label: 'Change Branch', icon: <GitBranch className="w-4 h-4" />, path: '/change-branch' },
      { label: 'Bulk Employee ID Update', icon: <Upload className="w-4 h-4" />, path: '/bulk-id-update' },
      { label: 'Hierarchy Chart', icon: <GitBranch className="w-4 h-4" />, path: '/hierarchy' },
      { label: 'Employee Resignation', icon: <UserMinus className="w-4 h-4" />, path: '/resignation' },
      { label: 'Other Employee', icon: <Users className="w-4 h-4" />, path: '/other-employee' },
      { label: 'Upcoming Retirement', icon: <Users className="w-4 h-4" />, path: '/retirement' },
      { label: 'Bulk Upload', icon: <Upload className="w-4 h-4" />, path: '/bulk-upload' }
    ]
  },
  {
    label: 'Departments',
    icon: <Building2 className="w-5 h-5" />,
    children: [
      { label: 'Department List', icon: <Building2 className="w-4 h-4" />, path: '/departments' },
      { label: 'Designations', icon: <FileText className="w-4 h-4" />, path: '/designations' },
      { label: 'Locations / Branches', icon: <MapPin className="w-4 h-4" />, path: '/locations' }
    ]
  },
  {
    label: 'Attendance',
    icon: <Calendar className="w-5 h-5" />,
    children: [
      { label: 'Attendance Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, path: '/attendance' },
      { label: 'View Attendance', icon: <Calendar className="w-4 h-4" />, path: '/attendance/view' },
      { label: 'Add Attendance', icon: <Calendar className="w-4 h-4" />, path: '/attendance/add' },
      { label: 'Monthly Attendance', icon: <Calendar className="w-4 h-4" />, path: '/attendance/monthly' },
      { label: 'Weekly Attendance', icon: <Calendar className="w-4 h-4" />, path: '/attendance/weekly' },
      { label: 'Out of Range Requests', icon: <MapPin className="w-4 h-4" />, path: '/attendance/out-of-range' },
      { label: 'Punch Missing', icon: <Clock className="w-4 h-4" />, path: '/attendance/punch-missing' },
      { label: 'Attendance Requests', icon: <FileText className="w-4 h-4" />, path: '/attendance/requests' },
      { label: 'Update Attendance', icon: <Calendar className="w-4 h-4" />, path: '/attendance/update' },
      { label: 'Update Break', icon: <Clock className="w-4 h-4" />, path: '/attendance/break' },
      { label: 'Week Off Exchange', icon: <Calendar className="w-4 h-4" />, path: '/attendance/week-off' },
      { label: 'Absent List', icon: <Calendar className="w-4 h-4" />, path: '/attendance/absent' },
      { label: 'Bulk Attendance', icon: <Upload className="w-4 h-4" />, path: '/attendance/bulk' },
      { label: 'Break Approval', icon: <Clock className="w-4 h-4" />, path: '/attendance/break-approval' },
      { label: 'Overtime Request', icon: <Clock className="w-4 h-4" />, path: '/attendance/overtime' },
      { label: 'Delete Attendance', icon: <Calendar className="w-4 h-4" />, path: '/attendance/delete' }
    ]
  },
  {
    label: 'Leave & WFH',
    icon: <Umbrella className="w-5 h-5" />,
    children: [
      { label: 'Leave Requests', icon: <FileText className="w-4 h-4" />, path: '/leave/requests' },
      { label: 'Leave Policies', icon: <FileText className="w-4 h-4" />, path: '/leave/policies' },
      { label: 'Leave Balance', icon: <BarChart3 className="w-4 h-4" />, path: '/leave/balance' },
      { label: 'WFH Requests', icon: <FileText className="w-4 h-4" />, path: '/wfh/requests' },
      { label: 'Hybrid Calendar', icon: <Calendar className="w-4 h-4" />, path: '/hybrid-calendar' }
    ]
  },
  {
    label: 'Payroll',
    icon: <DollarSign className="w-5 h-5" />,
    children: [
      { label: 'Employee CTC', icon: <DollarSign className="w-4 h-4" />, path: '/payroll' },
      { label: 'Create Salary Slip', icon: <FileText className="w-4 h-4" />, path: '/payroll/create-slip' },
      { label: 'Bulk Salary Slip', icon: <Upload className="w-4 h-4" />, path: '/payroll/bulk-slip' },
      { label: 'Generated Salary Slip', icon: <FileText className="w-4 h-4" />, path: '/payroll/generated' },
      { label: 'Verified Salary Slip', icon: <FileText className="w-4 h-4" />, path: '/payroll/verified' },
      { label: 'Published Salary Slip', icon: <FileText className="w-4 h-4" />, path: '/payroll/published' },
      { label: 'Incentives', icon: <DollarSign className="w-4 h-4" />, path: '/payroll/incentives' },
      { label: 'Other Earnings / Deductions', icon: <DollarSign className="w-4 h-4" />, path: '/payroll/other' },
      { label: 'Salary Hold', icon: <FileText className="w-4 h-4" />, path: '/payroll/hold' },
      { label: 'Increment', icon: <DollarSign className="w-4 h-4" />, path: '/payroll/increment' },
      { label: 'Swipe Group', icon: <Users className="w-4 h-4" />, path: '/payroll/swipe-group' },
      { label: 'Full & Final Settlement', icon: <FileText className="w-4 h-4" />, path: '/payroll/settlement' },
      { label: 'Bank Accounts', icon: <DollarSign className="w-4 h-4" />, path: '/payroll/bank' },
      { label: 'Form T', icon: <FileText className="w-4 h-4" />, path: '/payroll/form-t' }
    ]
  },
  {
    label: 'Finance & Accounting',
    icon: <FileText className="w-5 h-5" />,
    children: [
      { label: 'Finance Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, path: '/finance' },
      { label: 'Expenses', icon: <DollarSign className="w-4 h-4" />, path: '/finance/expenses' },
      { label: 'Advance Salary', icon: <DollarSign className="w-4 h-4" />, path: '/finance/advance' },
      { label: 'Employee Loan', icon: <DollarSign className="w-4 h-4" />, path: '/finance/loan' },
      { label: 'Tax Exemption', icon: <FileText className="w-4 h-4" />, path: '/finance/tax' },
      { label: 'Penalty', icon: <FileText className="w-4 h-4" />, path: '/finance/penalty' },
      { label: 'Income', icon: <DollarSign className="w-4 h-4" />, path: '/finance/income' },
      { label: 'Contract Salary', icon: <FileText className="w-4 h-4" />, path: '/finance/contract' },
      { label: 'Transactions', icon: <FileText className="w-4 h-4" />, path: '/finance/transactions' },
      { label: 'Balance Sheet', icon: <FileText className="w-4 h-4" />, path: '/finance/balance-sheet' }
    ]
  },
  {
    label: 'Productivity & Tracking',
    icon: <Target className="w-5 h-5" />,
    children: [
      { label: 'Employee Tracking', icon: <MapPin className="w-4 h-4" />, path: '/tracking/employee' },
      { label: 'Map View', icon: <MapPin className="w-4 h-4" />, path: '/tracking/map' },
      { label: 'GPS / Internet Summary', icon: <BarChart3 className="w-4 h-4" />, path: '/tracking/gps' },
      { label: 'Travel Summary', icon: <MapPin className="w-4 h-4" />, path: '/tracking/travel' },
      { label: 'Daily Work Report', icon: <FileText className="w-4 h-4" />, path: '/tracking/daily-report' },
      { label: 'Templates', icon: <FileText className="w-4 h-4" />, path: '/tracking/templates' },
      { label: 'Task Management', icon: <Target className="w-4 h-4" />, path: '/tracking/tasks' },
      { label: 'Task Sheet', icon: <FileText className="w-4 h-4" />, path: '/tracking/task-sheet' },
      { label: 'Targets & Achievements', icon: <Target className="w-4 h-4" />, path: '/tracking/targets' },
      { label: 'Work Allocation', icon: <Users className="w-4 h-4" />, path: '/tracking/allocation' },
      { label: 'Performance Matrix', icon: <BarChart3 className="w-4 h-4" />, path: '/tracking/performance' }
    ]
  },
  {
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    children: [
      { label: 'Company Settings', icon: <Building2 className="w-4 h-4" />, path: '/settings' },
      { label: 'Attendance Settings', icon: <Calendar className="w-4 h-4" />, path: '/settings/attendance' },
      { label: 'Shift Settings', icon: <Clock className="w-4 h-4" />, path: '/settings/shift' },
      { label: 'Leave Settings', icon: <Umbrella className="w-4 h-4" />, path: '/settings/leave' },
      { label: 'Payroll Settings', icon: <DollarSign className="w-4 h-4" />, path: '/settings/payroll' },
      { label: 'Tracking Settings', icon: <MapPin className="w-4 h-4" />, path: '/settings/tracking' },
      { label: 'Order & Visit Settings', icon: <FileText className="w-4 h-4" />, path: '/settings/order' },
      { label: 'Expense Settings', icon: <DollarSign className="w-4 h-4" />, path: '/settings/expense' },
      { label: 'Document Settings', icon: <FileText className="w-4 h-4" />, path: '/settings/document' },
      { label: 'Mobile Device Bind', icon: <Settings className="w-4 h-4" />, path: '/settings/mobile' },
      { label: 'Tax Settings', icon: <FileText className="w-4 h-4" />, path: '/settings/tax' },
      { label: 'App Access', icon: <Shield className="w-4 h-4" />, path: '/settings/app-access' },
      { label: 'Face App', icon: <Users className="w-4 h-4" />, path: '/settings/face-app' },
      { label: 'App Banner', icon: <FileText className="w-4 h-4" />, path: '/settings/banner' },
      { label: 'Task Settings', icon: <Target className="w-4 h-4" />, path: '/settings/task' },
      { label: 'Multi Level Settings', icon: <Settings className="w-4 h-4" />, path: '/settings/multi-level' }
    ]
  },
  {
    label: 'Security',
    icon: <Shield className="w-5 h-5" />,
    children: [
      { label: 'Login Logs', icon: <FileText className="w-4 h-4" />, path: '/security/login-logs' },
      { label: 'Activity Logs', icon: <FileText className="w-4 h-4" />, path: '/security/activity-logs' },
      { label: 'IP Restriction', icon: <Shield className="w-4 h-4" />, path: '/security/ip-restriction' },
      { label: 'Device Control', icon: <Shield className="w-4 h-4" />, path: '/security/device-control' },
      { label: 'Two Factor Authentication', icon: <Shield className="w-4 h-4" />, path: '/security/2fa' },
      { label: 'Audit Trail', icon: <FileText className="w-4 h-4" />, path: '/security/audit' }
    ]
  }
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) ? [] : [label]
    );
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const isParentActive = (children?: MenuItem[]) => {
    if (!children) return false;
    return children.some(child => isActive(child.path));
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-[#f9fafb] border-r border-[#e5e7eb] transition-all duration-300 z-40 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-[#e5e7eb]">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#4F46E5] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HR</span>
            </div>
            <span className="text-gray-900">HRMS Portal</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          {isCollapsed ? <Menu className="w-5 h-5 text-gray-600" /> : <X className="w-5 h-5 text-gray-600" />}
        </button>
      </div>

      <nav className="h-[calc(100vh-4rem)] overflow-y-auto p-3">
        {menuItems.map((item) => (
          <div key={item.label} className="mb-1">
            {item.children ? (
              <div>
                <button
                  onClick={() => toggleExpand(item.label)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isParentActive(item.children) || expandedItems.includes(item.label)
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-[#374151] hover:bg-[#f3f4f6]'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="shrink-0">{item.icon}</div>
                    {!isCollapsed && <span className="whitespace-nowrap truncate">{item.label}</span>}
                  </div>
                  {!isCollapsed && (
                    <span className="shrink-0">
                      {expandedItems.includes(item.label) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </button>
                {!isCollapsed && expandedItems.includes(item.label) && (
                  <div className="ml-3 mt-1 space-y-1 border-l-2 border-gray-100 pl-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        to={child.path || '#'}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all whitespace-nowrap ${
                          isActive(child.path)
                            ? 'bg-[#4F46E5] text-white'
                            : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                         <span className="shrink-0">-</span>
                        <span className="truncate">{child.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.path || '#'}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all overflow-hidden ${
                  isActive(item.path)
                    ? 'bg-[#4F46E5] text-white'
                    : 'text-[#374151] hover:bg-[#f3f4f6]'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <div className="shrink-0">{item.icon}</div>
                {!isCollapsed && <span className="whitespace-nowrap truncate">{item.label}</span>}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
