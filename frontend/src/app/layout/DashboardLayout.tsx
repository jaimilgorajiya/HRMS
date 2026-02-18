import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      <div
        className={`transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}
      >
        <Header />
        <main className="pt-24 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
