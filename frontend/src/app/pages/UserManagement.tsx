import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Plus, Edit, Trash2, Mail, Phone, MoreVertical } from 'lucide-react';

const mockEmployees = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+1 234-567-8901',
    role: 'Software Engineer',
    department: 'Engineering',
    position: 'Senior Developer',
    status: 'active',
    avatar: 'JD'
  },
  {
    id: 2,
    name: 'Sarah Smith',
    email: 'sarah.smith@company.com',
    phone: '+1 234-567-8902',
    role: 'Product Manager',
    department: 'Product',
    position: 'Manager',
    status: 'active',
    avatar: 'SS'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    phone: '+1 234-567-8903',
    role: 'Designer',
    department: 'Design',
    position: 'UI/UX Designer',
    status: 'active',
    avatar: 'MJ'
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    phone: '+1 234-567-8904',
    role: 'HR Manager',
    department: 'Human Resources',
    position: 'Manager',
    status: 'active',
    avatar: 'ED'
  },
  {
    id: 5,
    name: 'David Wilson',
    email: 'david.wilson@company.com',
    phone: '+1 234-567-8905',
    role: 'Marketing Lead',
    department: 'Marketing',
    position: 'Team Lead',
    status: 'inactive',
    avatar: 'DW'
  },
  {
    id: 6,
    name: 'Lisa Anderson',
    email: 'lisa.anderson@company.com',
    phone: '+1 234-567-8906',
    role: 'Sales Manager',
    department: 'Sales',
    position: 'Manager',
    status: 'active',
    avatar: 'LA'
  },
  {
    id: 7,
    name: 'Robert Brown',
    email: 'robert.brown@company.com',
    phone: '+1 234-567-8907',
    role: 'Backend Developer',
    department: 'Engineering',
    position: 'Developer',
    status: 'active',
    avatar: 'RB'
  },
  {
    id: 8,
    name: 'Jennifer Taylor',
    email: 'jennifer.taylor@company.com',
    phone: '+1 234-567-8908',
    role: 'Finance Manager',
    department: 'Finance',
    position: 'Manager',
    status: 'active',
    avatar: 'JT'
  }
];

export function UserManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredEmployees = mockEmployees.filter((employee) => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || employee.role === selectedRole;
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || employee.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 mt-1">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 mb-1">User Management</h1>
          <p className="text-sm text-gray-600">Manage all employees and their permissions</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
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
              onChange={(e) => setSelectedRole(e.target.value)}
              options={[
                { value: 'all', label: 'All Roles' },
                { value: 'Software Engineer', label: 'Software Engineer' },
                { value: 'Product Manager', label: 'Product Manager' },
                { value: 'Designer', label: 'Designer' },
                { value: 'HR Manager', label: 'HR Manager' },
                { value: 'Marketing Lead', label: 'Marketing Lead' }
              ]}
            />
            <Select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              options={[
                { value: 'all', label: 'All Departments' },
                { value: 'Engineering', label: 'Engineering' },
                { value: 'Product', label: 'Product' },
                { value: 'Design', label: 'Design' },
                { value: 'Human Resources', label: 'Human Resources' },
                { value: 'Marketing', label: 'Marketing' },
                { value: 'Sales', label: 'Sales' },
                { value: 'Finance', label: 'Finance' }
              ]}
            />
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
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
              {currentEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#4F46E5] rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">{employee.avatar}</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{employee.name}</p>
                        <p className="text-xs text-gray-500">{employee.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span className="text-xs">{employee.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-3 h-3" />
                        <span className="text-xs">{employee.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{employee.role}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-600">{employee.department}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-600">{employee.position}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={employee.status === 'active' ? 'success' : 'danger'}>
                      {employee.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
      </Card>

      {/* Add User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New User"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>
              Add User
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Full Name" placeholder="Enter full name" />
          <Input label="Email" type="email" placeholder="Enter email address" />
          <Input label="Phone" type="tel" placeholder="Enter phone number" />
          <Select
            label="Role"
            options={[
              { value: '', label: 'Select Role' },
              { value: 'Software Engineer', label: 'Software Engineer' },
              { value: 'Product Manager', label: 'Product Manager' },
              { value: 'Designer', label: 'Designer' }
            ]}
          />
          <Select
            label="Department"
            options={[
              { value: '', label: 'Select Department' },
              { value: 'Engineering', label: 'Engineering' },
              { value: 'Product', label: 'Product' },
              { value: 'Design', label: 'Design' }
            ]}
          />
          <Input label="Position" placeholder="Enter position" />
        </div>
      </Modal>
    </div>
  );
}
