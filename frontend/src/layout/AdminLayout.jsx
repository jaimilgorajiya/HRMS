import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const AdminLayout = ({ children, title: manualTitle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Helper to get title from path if not manually provided
  const getPageTitle = () => {
    if (manualTitle) return manualTitle;
    const path = location.pathname;
    
    if (path.includes('/admin/company/details')) return 'Company Details';
    if (path.includes('/admin/company/designation')) return 'Designation';
    if (path.includes('/admin/company/departments')) return 'Departments';
    if (path.includes('/admin/company/branches')) return 'Branches';
    if (path.includes('/admin/attendance/break-type')) return 'Break Type';
    if (path.includes('/admin/dashboard')) return 'Admin Dashboard';
    if (path === '/admin') return 'Admin Dashboard';
    
    return '';
  };

  const title = getPageTitle();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`admin-layout ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div className="main-wrapper">
        <Header title={title} toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
        <main className="content-area">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
