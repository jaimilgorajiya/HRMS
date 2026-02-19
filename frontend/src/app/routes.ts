import { createBrowserRouter } from 'react-router';
import { DashboardLayout } from './layout/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import Login from './pages/Login';
import { RequireAuth } from './components/auth/RequireAuth';
import { RoleBasedRedirect } from './components/auth/RoleBasedRedirect';
import { UserManagement } from './pages/UserManagement';
import UserForm from './pages/UserForm';
import UserView from './pages/UserView';
import { Attendance } from './pages/Attendance';
import { Payroll } from './pages/Payroll';
import { Settings } from './pages/Settings';
import { PlaceholderPage } from './pages/PlaceholderPage';
import DepartmentList from './pages/DepartmentList';
import DesignationList from './pages/DesignationList';
import LocationList from './pages/LocationList';

// User Management Pages
import RoleList from './pages/user-management/RoleList';
import GradeList from './pages/user-management/GradeList';
import ManagerList from './pages/user-management/ManagerList';
import ExEmployeeList from './pages/user-management/ExEmployeeList';
import ResignationList from './pages/user-management/ResignationList';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/',
    Component: RequireAuth,
    children: [
      {
        Component: DashboardLayout,
        children: [
          { index: true, Component: RoleBasedRedirect },
          { path: 'admin', Component: Dashboard },
          { path: 'manager', Component: Dashboard },
          { path: 'employee', Component: Dashboard },
          
          // User Management Routes
          { path: 'employees', Component: UserManagement },
          { path: 'employees/create', Component: UserForm },
          { path: 'employees/edit/:id', Component: UserForm },
          { path: 'employees/view/:id', Component: UserView },
          { path: 'management', Component: ManagerList },
          { path: 'ex-employees', Component: ExEmployeeList },
          { path: 'onboarding', Component: PlaceholderPage },
          { path: 'offboarding', Component: PlaceholderPage },
          { path: 'roles', Component: RoleList },
          { path: 'levels', Component: GradeList },
          { path: 'profile-changes', Component: PlaceholderPage },
          { path: 'change-branch', Component: PlaceholderPage },
          { path: 'bulk-id-update', Component: PlaceholderPage },
          { path: 'hierarchy', Component: PlaceholderPage },
          { path: 'resignation', Component: ResignationList },
          { path: 'other-employee', Component: PlaceholderPage },
          { path: 'retirement', Component: PlaceholderPage },
          { path: 'bulk-upload', Component: PlaceholderPage },
          
          // Departments Routes
          { path: 'departments', Component: DepartmentList },
          { path: 'designations', Component: DesignationList },
          { path: 'locations', Component: LocationList },
          
          // Attendance Routes
          { path: 'attendance', Component: Attendance },
          { path: 'attendance/view', Component: PlaceholderPage },
          { path: 'attendance/add', Component: PlaceholderPage },
          { path: 'attendance/monthly', Component: PlaceholderPage },
          { path: 'attendance/weekly', Component: PlaceholderPage },
          { path: 'attendance/out-of-range', Component: PlaceholderPage },
          { path: 'attendance/punch-missing', Component: PlaceholderPage },
          { path: 'attendance/requests', Component: PlaceholderPage },
          { path: 'attendance/update', Component: PlaceholderPage },
          { path: 'attendance/break', Component: PlaceholderPage },
          { path: 'attendance/week-off', Component: PlaceholderPage },
          { path: 'attendance/absent', Component: PlaceholderPage },
          { path: 'attendance/bulk', Component: PlaceholderPage },
          { path: 'attendance/break-approval', Component: PlaceholderPage },
          { path: 'attendance/overtime', Component: PlaceholderPage },
          { path: 'attendance/delete', Component: PlaceholderPage },
          
          // Leave & WFH Routes
          { path: 'leave/requests', Component: PlaceholderPage },
          { path: 'leave/policies', Component: PlaceholderPage },
          { path: 'leave/balance', Component: PlaceholderPage },
          { path: 'wfh/requests', Component: PlaceholderPage },
          { path: 'hybrid-calendar', Component: PlaceholderPage },
          
          // Payroll Routes
          { path: 'payroll', Component: Payroll },
          { path: 'payroll/create-slip', Component: PlaceholderPage },
          { path: 'payroll/bulk-slip', Component: PlaceholderPage },
          { path: 'payroll/generated', Component: PlaceholderPage },
          { path: 'payroll/verified', Component: PlaceholderPage },
          { path: 'payroll/published', Component: PlaceholderPage },
          { path: 'payroll/incentives', Component: PlaceholderPage },
          { path: 'payroll/other', Component: PlaceholderPage },
          { path: 'payroll/hold', Component: PlaceholderPage },
          { path: 'payroll/increment', Component: PlaceholderPage },
          { path: 'payroll/swipe-group', Component: PlaceholderPage },
          { path: 'payroll/settlement', Component: PlaceholderPage },
          { path: 'payroll/bank', Component: PlaceholderPage },
          { path: 'payroll/form-t', Component: PlaceholderPage },
          
          // Finance Routes
          { path: 'finance', Component: PlaceholderPage },
          { path: 'finance/expenses', Component: PlaceholderPage },
          { path: 'finance/advance', Component: PlaceholderPage },
          { path: 'finance/loan', Component: PlaceholderPage },
          { path: 'finance/tax', Component: PlaceholderPage },
          { path: 'finance/penalty', Component: PlaceholderPage },
          { path: 'finance/income', Component: PlaceholderPage },
          { path: 'finance/contract', Component: PlaceholderPage },
          { path: 'finance/transactions', Component: PlaceholderPage },
          { path: 'finance/balance-sheet', Component: PlaceholderPage },
          
          // Productivity & Tracking Routes
          { path: 'tracking/employee', Component: PlaceholderPage },
          { path: 'tracking/map', Component: PlaceholderPage },
          { path: 'tracking/gps', Component: PlaceholderPage },
          { path: 'tracking/travel', Component: PlaceholderPage },
          { path: 'tracking/daily-report', Component: PlaceholderPage },
          { path: 'tracking/templates', Component: PlaceholderPage },
          { path: 'tracking/tasks', Component: PlaceholderPage },
          { path: 'tracking/task-sheet', Component: PlaceholderPage },
          { path: 'tracking/targets', Component: PlaceholderPage },
          { path: 'tracking/allocation', Component: PlaceholderPage },
          { path: 'tracking/performance', Component: PlaceholderPage },
          
          // Settings Routes
          { path: 'settings', Component: Settings },
          { path: 'settings/attendance', Component: PlaceholderPage },
          { path: 'settings/shift', Component: PlaceholderPage },
          { path: 'settings/leave', Component: PlaceholderPage },
          { path: 'settings/payroll', Component: PlaceholderPage },
          { path: 'settings/tracking', Component: PlaceholderPage },
          { path: 'settings/order', Component: PlaceholderPage },
          { path: 'settings/expense', Component: PlaceholderPage },
          { path: 'settings/document', Component: PlaceholderPage },
          { path: 'settings/mobile', Component: PlaceholderPage },
          { path: 'settings/tax', Component: PlaceholderPage },
          { path: 'settings/app-access', Component: PlaceholderPage },
          { path: 'settings/face-app', Component: PlaceholderPage },
          { path: 'settings/banner', Component: PlaceholderPage },
          { path: 'settings/task', Component: PlaceholderPage },
          { path: 'settings/multi-level', Component: PlaceholderPage },
          
          // Security Routes
          { path: 'security/login-logs', Component: PlaceholderPage },
          { path: 'security/activity-logs', Component: PlaceholderPage },
          { path: 'security/ip-restriction', Component: PlaceholderPage },
          { path: 'security/device-control', Component: PlaceholderPage },
          { path: 'security/2fa', Component: PlaceholderPage },
          { path: 'security/audit', Component: PlaceholderPage },
          
          // 404 - Not Found
          { path: '*', Component: PlaceholderPage }
        ]
      }
    ]
  }
]);
