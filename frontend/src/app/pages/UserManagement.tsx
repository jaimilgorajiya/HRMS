import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Plus, Edit, Trash2, Mail, Phone, RefreshCw, ChevronDown } from 'lucide-react';

// Define interfaces based on backend models
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  position?: string;
  status: string;
  employeeId?: string;
  profilePhoto?: string;
  createdAt?: string;
}

interface Department {
  _id: string;
  name: string; 
}

export function UserManagement() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch Data on Mount
  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) {
        setEmployees(response.data.users);
      }
    } catch (err: any) {
      setError('Failed to fetch employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/departments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) {
         setDepartments(response.data.departments);
      }
    } catch (err) {
      console.error("Failed to fetch departments", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchEmployees();
    } catch (err: any) {
      console.error("Error deleting user:", err);
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  // Filter Logic
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = (employee.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (employee.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || employee.role === selectedRole;
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || (employee.status || 'Active') === selectedStatus;
    
    return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 mt-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 mb-1">User Management</h1>
          <p className="text-sm text-gray-600">Manage all employees and their permissions</p>
        </div>
        <div className="flex gap-2">
            <Button variant="secondary" onClick={fetchEmployees} title="Refresh List">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={() => navigate('/employees/create')}>
            <Plus className="w-4 h-4 mr-2" />
            Add User
            </Button>
        </div>
      </div>

      {/* Filters Section */}
      <Card>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select
              value={selectedRole}
              onChange={(value) => setSelectedRole(value)}
              options={[
                { value: 'all', label: 'All Roles' },
                { value: 'Admin', label: 'Admin' },
                { value: 'Manager', label: 'Manager' },
                { value: 'Employee', label: 'Employee' },
              ]}
            />
            <Select
              value={selectedDepartment}
              onChange={(value) => setSelectedDepartment(value)}
              options={[
                { value: 'all', label: 'All Departments' },
                ...departments.map(d => ({ value: d.name, label: d.name })) 
              ]}
            />
            <Select
              value={selectedStatus}
              onChange={(value) => setSelectedStatus(value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
                { value: 'Onboarding', label: 'Onboarding' }
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : currentEmployees.length === 0 ? (
                <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">No employees found.</td>
                </tr>
              ) : (
                currentEmployees.map((employee) => (
                    <tr 
                        key={employee._id} 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/employees/view/${employee._id}`)}
                    >
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#4F46E5] rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">
                                {employee.firstName ? employee.firstName[0] : (employee.name ? employee.name[0] : '?')}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-900">{employee.name}</p>
                            <p className="text-xs text-gray-500">{employee.employeeId || 'No ID'}</p>
                        </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-3 h-3" />
                            <span className="text-xs">{employee.email}</span>
                        </div>
                        {employee.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-3 h-3" />
                            <span className="text-xs">{employee.phone}</span>
                            </div>
                        )}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">{employee.role}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-600">{employee.department || '-'}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-600">{employee.position || '-'}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div onClick={(e) => e.stopPropagation()} className="relative w-32">
                            <select
                                value={employee.status}
                                onChange={async (e) => {
                                    const newStatus = e.target.value;
                                    const currentStatus = employee.status;

                                    const result = await Swal.fire({
                                        title: 'Are you sure?',
                                        text: `Do you want to change status from ${currentStatus} to ${newStatus}?`,
                                        icon: 'warning',
                                        showCancelButton: true,
                                        confirmButtonColor: '#3085d6',
                                        cancelButtonColor: '#d33',
                                        confirmButtonText: 'Yes, change it!'
                                    });

                                    if (result.isConfirmed) {
                                        try {
                                            await axios.put(`${import.meta.env.VITE_API_URL}/users/${employee._id}`, 
                                                { status: newStatus },
                                                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                                            );
                                            // Optimistic update or refresh
                                            setEmployees(prev => prev.map(u => u._id === employee._id ? { ...u, status: newStatus } : u));
                                            
                                            Swal.fire(
                                                'Updated!',
                                                `User status has been changed to ${newStatus}.`,
                                                'success'
                                            );
                                        } catch (err) {
                                            console.error("Failed to update status", err);
                                            Swal.fire(
                                                'Error!',
                                                'Failed to update status.',
                                                'error'
                                            );
                                        }
                                    } else {
                                        // Revert the change visually if needed (React should handle this on re-render, but forcing an update ensures it)
                                        // Just triggering a re-render with the same state is enough usually, 
                                        // or do nothing and React reconciles back to `value={employee.status}`
                                        e.target.value = currentStatus; 
                                    }
                                }}
                                className={`appearance-none w-full text-xs font-medium pl-3 pr-8 py-1.5 rounded-full cursor-pointer outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-sm ${
                                    employee.status === 'Active' 
                                        ? 'bg-green-100 text-green-800 border border-green-200 hover:border-green-300' 
                                        : employee.status === 'Inactive'
                                            ? 'bg-red-100 text-red-800 border border-red-200 hover:border-red-300'
                                            : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-400'
                                }`}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Onboarding">Onboarding</option>
                                <option value="Resigned">Resigned</option>
                                <option value="Terminated">Terminated</option>
                                <option value="Absconding">Absconding</option>
                                <option value="Retired">Retired</option>
                            </select>
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                <ChevronDown className="w-3 h-3" />
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                        <button 
                            onClick={(e) => { e.stopPropagation(); navigate(`/employees/edit/${employee._id}`); }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(employee._id); }}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                        </div>
                    </td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredEmployees.length)} of {filteredEmployees.length} results
            </p>
            <div className="flex items-center gap-2">
                <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                >
                Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                    key={page}
                    variant={currentPage === page ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                >
                    {page}
                </Button>
                ))}
                <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                >
                Next
                </Button>
            </div>
            </div>
        )}
      </Card>
    </div>
  );
}
