import React, { useState } from 'react';
import { Search, Bell, Settings, User, LogOut, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router';
import axios from 'axios';

export function Header() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`);
    } catch (error) {
      console.error('Logout error', error);
    } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        navigate('/login', { replace: true });
    }
  };

  const notifications = [
    { id: 1, title: 'New leave request', message: 'John Doe requested leave', time: '5 min ago' },
    { id: 2, title: 'Attendance marked', message: 'Sarah marked attendance', time: '15 min ago' },
    { id: 3, title: 'Salary slip generated', message: 'January 2026 salary slips ready', time: '1 hour ago' }
  ];

  return (
    <header className="fixed top-0 right-0 left-0 h-16 bg-white border-b border-gray-200 z-30">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl ml-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees, departments, tasks..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-6">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                    >
                      <h4 className="text-sm text-gray-900">{notification.title}</h4>
                      <p className="text-xs text-gray-600 mt-0.5">{notification.message}</p>
                      <span className="text-xs text-gray-400 mt-1 block">{notification.time}</span>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-gray-200">
                  <button className="text-sm text-[#4F46E5] hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-[#4F46E5] rounded-full flex items-center justify-center">
                <span className="text-white text-sm">AD</span>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@company.com</p>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <KeyRound className="w-4 h-4" />
                    <span>Change Password</span>
                  </button>
                  <hr className="my-2 border-gray-200" />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
