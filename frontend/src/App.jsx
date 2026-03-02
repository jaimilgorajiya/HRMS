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
              <Route path="company-settings" element={<ModulePlaceholder title="Company Settings" />} />
              <Route path="company/*" element={<ModulePlaceholder title="Company Management" />} />
              <Route path="attendance-settings" element={<ModulePlaceholder title="Attendance Settings" />} />
              <Route path="attendance/*" element={<ModulePlaceholder title="Attendance Management" />} />
              <Route path="shift-settings" element={<ModulePlaceholder title="Shift Settings" />} />
              <Route path="shift/*" element={<ModulePlaceholder title="Shift Management" />} />
              <Route path="leave-settings" element={<ModulePlaceholder title="Leave Settings" />} />
              <Route path="leave/*" element={<ModulePlaceholder title="Leave Management" />} />
              <Route path="payroll-settings" element={<ModulePlaceholder title="Payroll Settings" />} />
              <Route path="payroll/*" element={<ModulePlaceholder title="Payroll Management" />} />
              <Route path="document-settings" element={<ModulePlaceholder title="Document Settings" />} />
              <Route path="document/*" element={<ModulePlaceholder title="Document Management" />} />
              <Route path="app-access" element={<ModulePlaceholder title="App Access" />} />

              {/* Core HRMS placeholders */}
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
