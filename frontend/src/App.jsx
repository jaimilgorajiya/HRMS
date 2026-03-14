import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLayout from "./layout/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ModulePlaceholder from "./pages/ModulePlaceholder";
import CompanyDetails from "./pages/CompanyDetails";
import MyProfile from "./pages/MyProfile";
import Designation from "./pages/Designation";
import Branch from './pages/Branch';
import Department from './pages/Department';
import BreakType from './pages/BreakType';
import Shift from './pages/Shift';
import AddShift from './pages/AddShift';
import EditShift from './pages/EditShift';
import PenaltyRules from './pages/PenaltyRules';
import GraceTime from './pages/GraceTime';
import LeaveType from './pages/LeaveType';
import EarningDeductionType from './pages/EarningDeductionType';
import PayrollTaxSetting from './pages/PayrollTaxSetting';
import DocumentType from './pages/DocumentType';
import OnboardingDocSetting from './pages/OnboardingDocSetting';
import Employees from './pages/Employees';
import AddEmployee from './pages/AddEmployee';
import EmployeeManagement from './pages/EmployeeManagement';
import EmployeeProfile from './pages/EmployeeProfile';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login isRegister={false} />} />
          <Route path="/register" element={<Login isRegister={true} />} />

          {/* Admin Routes (Protected) */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="profile" element={<MyProfile />} />
              
              {/* Setup & Configuration placeholders */}
              <Route path="company/details" element={<CompanyDetails />} />
              <Route path="company/designation" element={<Designation />} />
              <Route path="company/departments" element={<Department />} />
              <Route path="company/branches" element={<Branch />} />
              <Route path="company/profile" element={<MyProfile />} />
              <Route path="company-settings" element={<ModulePlaceholder title="Company Settings" />} />
              <Route path="company/*" element={<ModulePlaceholder title="Company Management" />} />
              <Route path="attendance/break-type" element={<BreakType />} />
              <Route path="attendance-settings" element={<ModulePlaceholder title="Attendance Settings" />} />
              <Route path="attendance/*" element={<ModulePlaceholder title="Attendance Management" />} />
              <Route path="shift/add" element={<AddShift />} />
              <Route path="shift/edit/:id" element={<EditShift />} />
              <Route path="shift/manage" element={<Shift />} />
              <Route path="shift/penalty" element={<PenaltyRules />} />
              <Route path="shift/grace-time" element={<GraceTime />} />
              <Route path="shift-settings" element={<ModulePlaceholder title="Shift Settings" />} />
              <Route path="leave/type" element={<LeaveType />} />
              <Route path="leave/*" element={<ModulePlaceholder title="Leave Management" />} />
              <Route path="payroll-settings" element={<ModulePlaceholder title="Payroll Settings" />} />
              <Route path="payroll/tax-setting" element={<PayrollTaxSetting />} />
              <Route path="payroll/earning-deduction" element={<EarningDeductionType />} />
              <Route path="payroll/*" element={<ModulePlaceholder title="Payroll Management" />} />
              <Route path="document/emp-types" element={<DocumentType />} />
              <Route path="document/onboarding-setting" element={<OnboardingDocSetting />} />
              <Route path="document/*" element={<ModulePlaceholder title="Document Management" />} />
              <Route path="app-access" element={<ModulePlaceholder title="App Access" />} />

              {/* Core HRMS placeholders */}
              <Route path="employees/list" element={<Employees />} />
              <Route path="employees/add" element={<AddEmployee />} />
              <Route path="employees/profile/:id" element={<EmployeeProfile />} />
              <Route path="employees/manage" element={<EmployeeManagement />} />
              <Route path="employees/ex" element={<ModulePlaceholder title="Ex Employees" />} />
              <Route path="employees/onboarding" element={<ModulePlaceholder title="Employee Onboarding" />} />
              <Route path="employees/offboarding" element={<ModulePlaceholder title="Employee Offboarding" />} />
              <Route path="employees/mgmt-role" element={<ModulePlaceholder title="Management Role" />} />
              <Route path="employees/level-assign" element={<ModulePlaceholder title="Level Assign" />} />
              <Route path="employees/profile-request" element={<ModulePlaceholder title="Profile Request" />} />
              <Route path="employees/change-branch" element={<ModulePlaceholder title="Change Branch" />} />
              <Route path="employees/bulk-id" element={<ModulePlaceholder title="Bulk ID Update" />} />
              <Route path="employees/hierarchy" element={<ModulePlaceholder title="Hierarchy Chart" />} />
              <Route path="employees/resignation" element={<ModulePlaceholder title="Resignations" />} />
              <Route path="employees/other" element={<ModulePlaceholder title="Other Employees" />} />
              <Route path="employees/retirement" element={<ModulePlaceholder title="Upcoming Retirement" />} />
              <Route path="employees/bulk-upload" element={<ModulePlaceholder title="Bulk Upload" />} />
              <Route path="employees/promotion" element={<ModulePlaceholder title="Employee Promotion" />} />
              <Route path="employees/*" element={<ModulePlaceholder title="Employee Management" />} />
              <Route path="shifts/*" element={<ModulePlaceholder title="Shift Operations" />} />
              <Route path="leaves/*" element={<ModulePlaceholder title="Leave Operations" />} />
              <Route path="wfh/*" element={<ModulePlaceholder title="WFH Management" />} />
              <Route path="holidays/*" element={<ModulePlaceholder title="Holiday Management" />} />
              <Route path="documents/*" element={<ModulePlaceholder title="Company Documents" />} />
              <Route path="engagement/*" element={<ModulePlaceholder title="Employee Engagement" />} />
            </Route>
            {/* Compatibility redirect for the old dashboard path */}
            <Route path="/admin-dashboard" element={<Navigate to="/admin" replace />} />
          </Route>

          {/* Manager/Employee Dashboards (Placeholder protection) */}
          <Route element={<ProtectedRoute allowedRoles={['Manager']} />}>
            <Route path="/manager-dashboard" element={<Dashboard title="Manager Dashboard" />} />
          </Route>
          
          <Route element={<ProtectedRoute allowedRoles={['Employee']} />}>
            <Route path="/employee-dashboard" element={<Dashboard title="Employee Dashboard" />} />
          </Route>

          {/* Root/Default Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
