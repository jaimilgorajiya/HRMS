import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { DollarSign, FileText, TrendingUp, Users, Download, Upload, Eye, CheckCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const monthlyPayroll = [
  { month: 'Aug', amount: 4500000, employees: 1180 },
  { month: 'Sep', amount: 4700000, employees: 1195 },
  { month: 'Oct', amount: 4650000, employees: 1205 },
  { month: 'Nov', amount: 4900000, employees: 1220 },
  { month: 'Dec', amount: 5200000, employees: 1235 },
  { month: 'Jan', amount: 5100000, employees: 1248 }
];

const departmentPayroll = [
  { department: 'Engineering', amount: 2100000 },
  { department: 'Sales', amount: 1200000 },
  { department: 'Marketing', amount: 850000 },
  { department: 'HR', amount: 450000 },
  { department: 'Finance', amount: 500000 }
];

const salarySlips = [
  {
    id: 1,
    employeeName: 'John Doe',
    employeeId: 'EMP001',
    department: 'Engineering',
    month: 'January 2026',
    gross: 125000,
    deductions: 15000,
    net: 110000,
    status: 'published'
  },
  {
    id: 2,
    employeeName: 'Sarah Smith',
    employeeId: 'EMP002',
    department: 'Product',
    month: 'January 2026',
    gross: 135000,
    deductions: 17000,
    net: 118000,
    status: 'verified'
  },
  {
    id: 3,
    employeeName: 'Mike Johnson',
    employeeId: 'EMP003',
    department: 'Design',
    month: 'January 2026',
    gross: 115000,
    deductions: 13500,
    net: 101500,
    status: 'generated'
  },
  {
    id: 4,
    employeeName: 'Emily Davis',
    employeeId: 'EMP004',
    department: 'HR',
    month: 'January 2026',
    gross: 105000,
    deductions: 12000,
    net: 93000,
    status: 'published'
  },
  {
    id: 5,
    employeeName: 'David Wilson',
    employeeId: 'EMP005',
    department: 'Marketing',
    month: 'January 2026',
    gross: 98000,
    deductions: 11000,
    net: 87000,
    status: 'verified'
  }
];

export function Payroll() {
  const [selectedMonth, setSelectedMonth] = useState('january-2026');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    {
      title: 'Total Payroll',
      value: '$5.1M',
      icon: <DollarSign className="w-6 h-6 text-green-600" />,
      change: '+4.2% from last month',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Employees Paid',
      value: '1,248',
      icon: <Users className="w-6 h-6 text-blue-600" />,
      change: '+12 this month',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Avg. Salary',
      value: '$4,087',
      icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
      change: '+2.8% from last month',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Pending Slips',
      value: '23',
      icon: <FileText className="w-6 h-6 text-orange-600" />,
      change: 'Need verification',
      bgColor: 'bg-orange-50'
    }
  ];

  const filteredSlips = salarySlips.filter(slip =>
    slip.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    slip.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 mb-1">Payroll Management</h1>
          <p className="text-sm text-gray-600">Manage employee salaries and salary slips</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Generate Slips
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-2xl text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-xs text-gray-500">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Payroll Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Payroll Trend (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyPayroll}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#4F46E5" strokeWidth={2} name="Total Amount" />
                <Line type="monotone" dataKey="employees" stroke="#10B981" strokeWidth={2} name="Employees" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department-wise Payroll */}
        <Card>
          <CardHeader>
            <CardTitle>Department-wise Payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentPayroll} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `$${value / 1000}k`} />
                <YAxis type="category" dataKey="department" width={100} />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Bar dataKey="amount" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Salary Slips Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Salary Slips</CardTitle>
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
              <Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                options={[
                  { value: 'january-2026', label: 'January 2026' },
                  { value: 'december-2025', label: 'December 2025' },
                  { value: 'november-2025', label: 'November 2025' }
                ]}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">
                    Gross Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">
                    Deductions
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">
                    Net Salary
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
                {filteredSlips.map((slip) => (
                  <tr key={slip.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm text-gray-900">{slip.employeeName}</p>
                        <p className="text-xs text-gray-500">{slip.employeeId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-600">{slip.department}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-600">{slip.month}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">${slip.gross.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-red-600">-${slip.deductions.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-green-600">${slip.net.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={
                        slip.status === 'published' ? 'success' :
                        slip.status === 'verified' ? 'info' : 'warning'
                      }>
                        {slip.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-green-50 rounded-lg transition-colors">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </button>
                        <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                          <Download className="w-4 h-4 text-blue-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
