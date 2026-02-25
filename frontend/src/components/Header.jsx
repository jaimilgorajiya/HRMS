import React from 'react';
import '../styles/admin.css';

const Header = ({ title, toggleSidebar, isCollapsed }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

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
        <h1 className="page-title">{title || "Dashboard"}</h1>
      </div>
      
      <div className="header-search">
        <div className="search-wrapper">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder="Search by Candidates, Jobs, Companies" />
        </div>
      </div>

      <div className="header-right">
        <button className="icon-btn add-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
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
            <img src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff" alt="Avatar" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
