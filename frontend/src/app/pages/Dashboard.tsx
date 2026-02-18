import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { StatusWidget } from '../components/StatusWidget';
import { Users, UserCheck, Calendar, FileText, Building2, AlertTriangle, Clock, UserX, Umbrella, Home, MapPin, AlertCircle, Timer, Briefcase, Mountain, DollarSign, UserCog, Scan, CreditCard, Smartphone, FileCheck } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const attendanceData = [
  { name: 'Present', value: 850, color: '#10B981' },
  { name: 'Absent', value: 45, color: '#EF4444' },
  { name: 'Leave', value: 80, color: '#F59E0B' },
  { name: 'WFH', value: 125, color: '#3B82F6' }
];

const leaveTrendData = [
  { month: 'Aug', casual: 45, sick: 23, earned: 12 },
  { month: 'Sep', casual: 52, sick: 31, earned: 15 },
  { month: 'Oct', casual: 48, sick: 28, earned: 18 },
  { month: 'Nov', casual: 55, sick: 35, earned: 20 },
  { month: 'Dec', casual: 62, sick: 42, earned: 25 },
  { month: 'Jan', casual: 58, sick: 38, earned: 22 }
];

const payrollData = [
  { month: 'Aug', amount: 4500000 },
  { month: 'Sep', amount: 4700000 },
  { month: 'Oct', amount: 4650000 },
  { month: 'Nov', amount: 4900000 },
  { month: 'Dec', amount: 5200000 },
  { month: 'Jan', amount: 5100000 }
];

const taskStatusData = [
  { name: 'Completed', value: 245, color: '#10B981' },
  { name: 'In Progress', value: 128, color: '#3B82F6' },
  { name: 'Pending', value: 89, color: '#F59E0B' },
  { name: 'Overdue', value: 34, color: '#EF4444' }
];

export function Dashboard() {
  const stats = [
    {
      title: 'Total Employees',
      value: '1,248',
      icon: <Users className="w-6 h-6 text-[#4F46E5]" />,
      change: '+12 this month',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Employees',
      value: '1,185',
      icon: <UserCheck className="w-6 h-6 text-green-600" />,
      change: '+8 this month',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Present Today',
      value: '975',
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      change: '82% attendance',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Pending Requests',
      value: '47',
      icon: <FileText className="w-6 h-6 text-orange-600" />,
      change: '12 leave, 35 other',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Departments',
      value: '24',
      icon: <Building2 className="w-6 h-6 text-purple-600" />,
      change: '3 new this year',
      bgColor: 'bg-purple-50'
    }
  ];

  const warnings = [
    { type: 'Missing Bank Details', count: 12, color: 'text-red-600' },
    { type: 'Missing ID Proof', count: 8, color: 'text-orange-600' },
    { type: 'Missing CTC', count: 5, color: 'text-yellow-600' },
    { type: 'No Shift Assigned', count: 15, color: 'text-red-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl text-gray-900 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Quick Status Widgets */}
      <div className="space-y-4">
        {/* Attendance Status */}
        <div>
          <h3 className="text-sm text-gray-700 mb-3">TODAY'S ATTENDANCE STATUS & PUNCHING STATUS</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
            <StatusWidget
              icon={<UserCheck className="w-5 h-5 text-green-600" />}
              label="Present"
              count={975}
              color="bg-green-50"
              onClick={() => console.log('Navigate to Present')}
            />
            <StatusWidget
              icon={<Clock className="w-5 h-5 text-orange-600" />}
              label="Late In"
              count={32}
              color="bg-orange-50"
              onClick={() => console.log('Navigate to Late In')}
            />
            <StatusWidget
              icon={<UserX className="w-5 h-5 text-red-600" />}
              label="Absent"
              count={45}
              color="bg-red-50"
              onClick={() => console.log('Navigate to Absent')}
            />
            <StatusWidget
              icon={<Umbrella className="w-5 h-5 text-blue-600" />}
              label="Full Day Leave"
              count={80}
              color="bg-blue-50"
              onClick={() => console.log('Navigate to Full Day Leave')}
            />
            <StatusWidget
              icon={<MapPin className="w-5 h-5 text-purple-600" />}
              label="Out Of Range"
              count={8}
              color="bg-purple-50"
              onClick={() => console.log('Navigate to Out Of Range')}
            />
            <StatusWidget
              icon={<AlertCircle className="w-5 h-5 text-yellow-600" />}
              label="Punch Out Missing"
              count={15}
              color="bg-yellow-50"
              onClick={() => console.log('Navigate to Punch Out Missing')}
            />
            <StatusWidget
              icon={<Timer className="w-5 h-5 text-gray-600" />}
              label="Past Attendance"
              count={3}
              color="bg-gray-50"
              onClick={() => console.log('Navigate to Past Attendance')}
            />
          </div>
        </div>

        {/* Request Status */}
        <div>
          <h3 className="text-sm text-gray-700 mb-3">REQUEST STATUS</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <StatusWidget
              icon={<Umbrella className="w-5 h-5 text-blue-600" />}
              label="Leave Requests"
              count={12}
              color="bg-blue-50"
              onClick={() => console.log('Navigate to Leave Requests')}
            />
            <StatusWidget
              icon={<Home className="w-5 h-5 text-indigo-600" />}
              label="WFH Request"
              count={8}
              color="bg-indigo-50"
              onClick={() => console.log('Navigate to WFH Requests')}
            />
            <StatusWidget
              icon={<Briefcase className="w-5 h-5 text-cyan-600" />}
              label="Shift Change"
              count={5}
              color="bg-cyan-50"
              onClick={() => console.log('Navigate to Shift Change')}
            />
            <StatusWidget
              icon={<Clock className="w-5 h-5 text-orange-600" />}
              label="Overtime Request"
              count={7}
              color="bg-orange-50"
              onClick={() => console.log('Navigate to Overtime Request')}
            />
            <StatusWidget
              icon={<Mountain className="w-5 h-5 text-teal-600" />}
              label="Short Leave"
              count={4}
              color="bg-teal-50"
              onClick={() => console.log('Navigate to Short Leave')}
            />
            <StatusWidget
              icon={<DollarSign className="w-5 h-5 text-green-600" />}
              label="Expense Claims"
              count={18}
              color="bg-green-50"
              onClick={() => console.log('Navigate to Expense Claims')}
            />
            <StatusWidget
              icon={<UserCog className="w-5 h-5 text-purple-600" />}
              label="Profile Change"
              count={6}
              color="bg-purple-50"
              onClick={() => console.log('Navigate to Profile Change')}
            />
           
            <StatusWidget
              icon={<CreditCard className="w-5 h-5 text-blue-600" />}
              label="Bank Change"
              count={3}
              color="bg-blue-50"
              onClick={() => console.log('Navigate to Bank Change')}
            />
           
            <StatusWidget
              icon={<FileCheck className="w-5 h-5 text-gray-600" />}
              label="Tax Document"
              count={9}
              color="bg-gray-50"
              onClick={() => console.log('Navigate to Tax Document')}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              {attendanceData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leave Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Trends (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leaveTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="casual" fill="#3B82F6" name="Casual Leave" />
                <Bar dataKey="sick" fill="#10B981" name="Sick Leave" />
                <Bar dataKey="earned" fill="#F59E0B" name="Earned Leave" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payroll Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Payroll Summary (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={payrollData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#4F46E5" strokeWidth={2} name="Total Payroll" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Status */}
        <Card>
          <CardHeader>
            <CardTitle>Task Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              {taskStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warning Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <CardTitle>Action Required</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {warnings.map((warning, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className={`text-2xl ${warning.color} mb-1`}>{warning.count}</p>
                <p className="text-sm text-gray-700">{warning.type}</p>
                <button className="mt-2 text-xs text-[#4F46E5] hover:underline">
                  View Details →
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Work Report Status */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { user: 'John Doe', action: 'submitted leave request', time: '2 minutes ago', status: 'pending' },
              { user: 'Sarah Smith', action: 'marked attendance', time: '15 minutes ago', status: 'success' },
              { user: 'Mike Johnson', action: 'submitted expense report', time: '1 hour ago', status: 'pending' },
              { user: 'Emily Davis', action: 'completed onboarding', time: '2 hours ago', status: 'success' },
              { user: 'David Wilson', action: 'requested salary advance', time: '3 hours ago', status: 'pending' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#4F46E5] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">{activity.user.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  activity.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}