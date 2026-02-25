import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ title, toggleSidebar, isCollapsed }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const placeholders = [
    "Search for modules...",
    "Search for Designation...",
    "Search for Employees...",
    "Search for Attendance...",
    "Search for Payroll...",
    "Search for Holidays...",
    "Search for WFH...",
    "Search for upcoming events..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Flattened menu items for searching - normally this might come from a shared config
  const searchableItems = [
    { title: "Dashboard", path: "/admin" },
    { title: "Company details", path: "/admin/company/details" },
    { title: "Designation", path: "/admin/company/designation" },
    { title: "Branches", path: "/admin/company/branches" },
    { title: "Departments", path: "/admin/company/departments" },
    { title: "Daily Attendance Email", path: "/admin/company/attendance-email" },
    { title: "Break Type", path: "/admin/attendance/break-type" },
    { title: "Attendance/Breaks Setting", path: "/admin/attendance/breaks-setting" },
    { title: "EMP Attendance Setting", path: "/admin/attendance/emp-setting" },
    { title: "Add Shift", path: "/admin/shift/add" },
    { title: "Manage Shift", path: "/admin/shift/manage" },
    { title: "Penalty Rules", path: "/admin/shift/penalty" },
    { title: "Add Next Day Grace Time", path: "/admin/shift/grace-time" },
    { title: "Leave Type", path: "/admin/leave/type" },
    { title: "Leave Group", path: "/admin/leave/group" },
    { title: "Payroll & Tax Setting", path: "/admin/payroll/tax-setting" },
    { title: "Earning & Deduction Type", path: "/admin/payroll/earning-deduction" },
    { title: "Employee Documents Types", path: "/admin/document/emp-types" },
    { title: "Onboarding Doc. Setting", path: "/admin/document/onboarding-setting" },
    { title: "App Access", path: "/admin/app-access" },
    { title: "Employees Management", path: "/admin/employees/manage" },
    { title: "Ex Employee", path: "/admin/employees/ex" },
    { title: "Emp Onboarding", path: "/admin/employees/onboarding" },
    { title: "Emp Offboarding", path: "/admin/employees/offboarding" },
    { title: "Shift Rotation", path: "/admin/shifts/rotation" },
    { title: "Emp Shift", path: "/admin/shifts/emp" },
    { title: "Shift change request", path: "/admin/shifts/request" },
    { title: "Attendance Dashboard", path: "/admin/attendance/dashboard" },
    { title: "View Attendance", path: "/admin/attendance/view" },
    { title: "Add Attendance", path: "/admin/attendance/add" },
    { title: "Monthly Attendance", path: "/admin/attendance/monthly" },
    { title: "Pending Attendance", path: "/admin/attendance/pending" },
    { title: "Punch Out Request", path: "/admin/attendance/punch-request" },
    { title: "Punch Out Missing", path: "/admin/attendance/punch-missing" },
    { title: "Attendance Request", path: "/admin/attendance/request" },
    { title: "Absent Emp", path: "/admin/attendance/absent" },
    { title: "Delete Attendance", path: "/admin/attendance/delete" },
    { title: "Assign Bulk Leave", path: "/admin/leaves/bulk" },
    { title: "Leave Balance", path: "/admin/leaves/balance" },
    { title: "Leave Request", path: "/admin/leaves/request" },
    { title: "Auto Leave", path: "/admin/leaves/auto" },
    { title: "Leave Pay Out", path: "/admin/leaves/payout" },
    { title: "Short Leave", path: "/admin/leaves/short" },
    { title: "Sandwich Leave", path: "/admin/leaves/sandwich" },
    { title: "Deleted Auto Leave", path: "/admin/leaves/auto-deleted" },
    { title: "Leave Enchashment Request", path: "/admin/leaves/encashment" },
    { title: "Carry Forward Leave", path: "/admin/leaves/carry-forward" },
    { title: "Short Leave Request", path: "/admin/leaves/short-request" },
    { title: "Leave Cancellation", path: "/admin/leaves/cancellation" },
    { title: "Employee CTC", path: "/admin/payroll/ctc" },
    { title: "Create Salary Slip", path: "/admin/payroll/create" },
    { title: "Create Bulk Salary Slip", path: "/admin/payroll/create-bulk" },
    { title: "Generated Salary Slip", path: "/admin/payroll/generated" },
    { title: "Checked Salary Slip", path: "/admin/payroll/checked" },
    { title: "Published Salary Slip", path: "/admin/payroll/published" },
    { title: "Other Earning / Deduction", path: "/admin/payroll/other" },
    { title: "Manage Incentive", path: "/admin/payroll/incentive" },
    { title: "FnF", path: "/admin/payroll/fnf" },
    { title: "Bank Accounts", path: "/admin/payroll/bank" },
    { title: "Form T", path: "/admin/payroll/form-t" },
    { title: "WFH Requests", path: "/admin/wfh/requests" },
    { title: "WFH Balance Sheet", path: "/admin/wfh/balance" },
    { title: "Add Holiday", path: "/admin/holidays/add" },
    { title: "Manage Holiday", path: "/admin/holidays/manage" },
    { title: "Manage Company Docs", path: "/admin/documents/company" },
    { title: "Employee Docs", path: "/admin/documents/employee" },
    { title: "Upcoming Celebrations", path: "/admin/engagement/celebrations" }
  ];

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const filtered = searchableItems.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
    setShowResults(true);
  }, [searchQuery]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (path) => {
    navigate(path);
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <button className="icon-btn toggle-btn" onClick={toggleSidebar}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isCollapsed ? (
              <path d="M4 6h16M4 12h16M4 18h16" />
            ) : (
              <path d="M4 6h16M4 12h10M4 18h16" />
            )}
          </svg>
        </button>
        <h1 className="page-title">{title || ""}</h1>
      </div>
      
      <div className="header-search" ref={searchRef}>
        <div className="search-wrapper">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder={placeholders[placeholderIndex]}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery && setShowResults(true)}
          />
        </div>
        
        {showResults && searchResults.length > 0 && (
          <div className="search-dropdown">
            {searchResults.map((result, index) => (
              <div 
                key={index} 
                className="search-result-item" 
                onClick={() => handleResultClick(result.path)}
              >
                {result.title}
              </div>
            ))}
          </div>
        )}
        {showResults && searchQuery && searchResults.length === 0 && (
          <div className="search-dropdown">
            <div className="search-no-results">No modules found</div>
          </div>
        )}
      </div>

      <div className="header-right">
      
        <button className="icon-btn notification-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span className="badge"></span>
        </button>
        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">{user.name || "Admin"}</span>
          </div>
          <div className="avatar">
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'Admin')}&background=0D8ABC&color=fff`} alt="Avatar" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
