import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const Sidebar = ({ isCollapsed }) => {
  const [expandedMenus, setExpandedMenus] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // Automatically expand parent menus based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    const newExpandedMenus = {};

    menuItems.forEach(item => {
      if (item.subItems) {
        let isParentActive = false;
        item.subItems.forEach(sub => {
          if (sub.children) {
            const isSubParentActive = sub.children.some(child => child.path === currentPath);
            if (isSubParentActive) {
              newExpandedMenus[sub.title] = true;
              isParentActive = true;
            }
          } else if (sub.path === currentPath) {
            isParentActive = true;
          }
        });

        if (isParentActive) {
          newExpandedMenus[item.title] = true;
        }
      }
    });

    setExpandedMenus(newExpandedMenus);
  }, [location.pathname]);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your session!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3A82F6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'No, stay logged in'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        
        Swal.fire({
          title: 'Logged Out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const toggleMenu = (key, siblings = []) => {
    setExpandedMenus(prev => {
      const isOpening = !prev[key];
      const newState = { ...prev, [key]: isOpening };
      
      if (isOpening && siblings.length > 0) {
        siblings.forEach(sibling => {
          if (sibling !== key) {
            newState[sibling] = false;
          }
        });
      }
      return newState;
    });
  };

  const menuItems = [
// ... existing menuItems ...
// Update the rendering logic below:
// In the map:
// For top-level segments:
// onClick={() => toggleMenu(item.title, menuItems.filter(m => m.subItems).map(m => m.title))}
// For sub-menus:
// onClick={() => toggleMenu(sub.title, item.subItems.filter(s => s.children).map(s => s.title))}

    {
      title: "Dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      path: "/admin-dashboard",
    },
    {
      title: "Setup & Configuration",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
      subItems: [
        { 
          title: "Company Setting", 
          path: "/admin/company-settings",
          children: [
            { title: "Company details", path: "/admin/company/details" },
            { title: "Designation", path: "/admin/company/designation" },
            { title: "Branches", path: "/admin/company/branches" },
            { title: "Departments", path: "/admin/company/departments" },
            { title: "Daily Attendance Email", path: "/admin/company/attendance-email" }
          ]
        },
        { 
          title: "Attendance Setting", 
          path: "/admin/attendance-settings",
          children: [
            { title: "Break Type", path: "/admin/attendance/break-type" },
            { title: "Attendance/Breaks Setting", path: "/admin/attendance/breaks-setting" },
            { title: "EMP Attendance Setting", path: "/admin/attendance/emp-setting" }
          ]
        },
        { 
          title: "Shift Setting", 
          path: "/admin/shift-settings",
          children: [
            { title: "Add Shift", path: "/admin/shift/add" },
            { title: "Manage Shift", path: "/admin/shift/manage" },
            { title: "Penalty Rules", path: "/admin/shift/penalty" },
            { title: "Add Next Day Grace Time", path: "/admin/shift/grace-time" }
          ]
        },
        { 
          title: "Leave Setting", 
          path: "/admin/leave-settings",
          children: [
            { title: "Leave Type", path: "/admin/leave/type" },
            { title: "Leave Group", path: "/admin/leave/group" }
          ]
        },
        { 
          title: "Payroll Setting", 
          path: "/admin/payroll-settings",
          children: [
            { title: "Payroll & Tax Setting", path: "/admin/payroll/tax-setting" },
            { title: "Earning & Deduction Type", path: "/admin/payroll/earning-deduction" }
          ]
        },
        { 
          title: "Document Setting", 
          path: "/admin/document-settings",
          children: [
            { title: "Employee Documents Types", path: "/admin/document/emp-types" },
            { title: "Onboarding Doc. Setting", path: "/admin/document/onboarding-setting" }
          ]
        },
        { title: "App Access", path: "/admin/app-access" }
      ]
    },
    {
      title: "Core HRMS",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      subItems: [
        { 
          title: "Employee Management", 
          path: "/admin/employees",
          children: [
            { title: "Employees Management", path: "/admin/employees/manage" },
            { title: "Ex Employee", path: "/admin/employees/ex" },
            { title: "Emp Onboarding", path: "/admin/employees/onboarding" },
            { title: "Emp Offboarding", path: "/admin/employees/offboarding" }
          ]
        },
        { 
          title: "Shift Management", 
          path: "/admin/shifts",
          children: [
            { title: "Shift Rotation", path: "/admin/shifts/rotation" },
            { title: "Emp Shift", path: "/admin/shifts/emp" },
            { title: "Shift change request", path: "/admin/shifts/request" }
          ]
        },
        { 
          title: "Attendance", 
          path: "/admin/attendance",
          children: [
            { title: "Attendance Dashboard", path: "/admin/attendance/dashboard" },
            { title: "View Attendance", path: "/admin/attendance/view" },
            { title: "Add Attendance", path: "/admin/attendance/add" },
            { title: "Monthly Attendance", path: "/admin/attendance/monthly" },
            { title: "Pending Attendance", path: "/admin/attendance/pending" },
            { title: "Punch Out Request", path: "/admin/attendance/punch-request" },
            { title: "Punch Out Missing", path: "/admin/attendance/punch-missing" },
            { title: "Attendance Request", path: "/admin/attendance/request" },
            { title: "Absent Emp", path: "/admin/attendance/absent" },
            { title: "Delete Attendance", path: "/admin/attendance/delete" }
          ]
        },
        { 
          title: "Leave Management", 
          path: "/admin/leaves",
          children: [
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
            { title: "Leave Cancellation", path: "/admin/leaves/cancellation" }
          ]
        },
        { 
          title: "Payroll", 
          path: "/admin/payroll",
          children: [
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
            { title: "Form T", path: "/admin/payroll/form-t" }
          ]
        },
        { 
          title: "WFH Management", 
          path: "/admin/wfh",
          children: [
            { title: "WFH Requests", path: "/admin/wfh/requests" },
            { title: "WFH Balance Sheet", path: "/admin/wfh/balance" }
          ]
        },
        { 
          title: "Holidays", 
          path: "/admin/holidays",
          children: [
            { title: "Add Holiday", path: "/admin/holidays/add" },
            { title: "Manage Holiday", path: "/admin/holidays/manage" }
          ]
        },
        { 
          title: "Documents", 
          path: "/admin/documents",
          children: [
            { title: "Manage Company Docs", path: "/admin/documents/company" },
            { title: "Employee Docs", path: "/admin/documents/employee" }
          ]
        },
        { 
          title: "Emp Engagement", 
          path: "/admin/engagement",
          children: [
            { title: "Upcoming Celebrations", path: "/admin/engagement/celebrations" }
          ]
        }
      ]
    }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img 
          src={isCollapsed ? "/iipl-logo.png" : "/iipl-horizontal-logo.png"} 
          alt="Logo" 
        />
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <div key={index} className="menu-group">
            {item.subItems ? (
              <div className="has-submenu">
                <button 
                  className={`menu-item ${expandedMenus[item.title] ? 'active' : ''}`}
                  onClick={() => toggleMenu(item.title, menuItems.filter(m => m.subItems).map(m => m.title))}
                >
                  <span className="icon-wrapper">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d={item.icon} />
                    </svg>
                  </span>
                  {!isCollapsed && (
                    <>
                      <span className="menu-text">{item.title}</span>
                      <span className={`arrow ${expandedMenus[item.title] ? 'open' : ''}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </>
                  )}
                </button>
                {!isCollapsed && expandedMenus[item.title] && (
                  <ul className="submenu">
                    {item.subItems.map((sub, sIdx) => (
                      <li key={sIdx} className="submenu-item-container">
                        {sub.children ? (
                          <>
                            <div 
                              className={`submenu-label ${expandedMenus[sub.title] ? 'expanded' : ''}`}
                              onClick={() => toggleMenu(sub.title, item.subItems.filter(s => s.children).map(s => s.title))}
                            >
                              <div className="label-content">
                                <span className="sub-icon">
                                  <svg width="6" height="6" viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="12" cy="12" r="12" />
                                  </svg>
                                </span>
                                {sub.title}
                              </div>
                              <svg className={`sub-arrow ${expandedMenus[sub.title] ? 'open' : ''}`} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                            {expandedMenus[sub.title] && (
                              <ul className="nested-submenu">
                                {sub.children.map((child, cIdx) => (
                                  <li key={cIdx}>
                                    <NavLink to={child.path} className={({ isActive }) => isActive ? 'active' : ''}>
                                      <span className="nested-dot"></span>
                                      {child.title}
                                    </NavLink>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </>
                        ) : (
                          <NavLink to={sub.path} className={({ isActive }) => isActive ? 'active' : ''}>
                            <span className="sub-icon">
                              <svg width="6" height="6" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="12" cy="12" r="12" />
                              </svg>
                            </span>
                            {sub.title}
                          </NavLink>
                        )
                        }
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <NavLink 
                to={item.path} 
                className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}
              >
                <span className="icon-wrapper">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d={item.icon} />
                  </svg>
                </span>
                {!isCollapsed && <span className="menu-text">{item.title}</span>}
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
       
        <button className="menu-item logout" onClick={handleLogout}>
          <span className="icon-wrapper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </span>
          {!isCollapsed && <span className="menu-text">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
