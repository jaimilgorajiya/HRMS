import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Calendar, Clock, UserCheck, UserX, Home, MapPin, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const weeklyAttendance = [
  { day: 'Mon', present: 980, absent: 35, leave: 65, wfh: 120 },
  { day: 'Tue', present: 975, absent: 40, leave: 70, wfh: 115 },
  { day: 'Wed', present: 990, absent: 30, leave: 60, wfh: 120 },
  { day: 'Thu', present: 985, absent: 35, leave: 65, wfh: 115 },
  { day: 'Fri', present: 970, absent: 45, leave: 75, wfh: 110 }
];

const departmentAttendance = [
  { name: 'Engineering', value: 85, color: '#4F46E5' },
  { name: 'Sales', value: 78, color: '#10B981' },
  { name: 'Marketing', value: 82, color: '#F59E0B' },
  { name: 'HR', value: 92, color: '#EF4444' },
  { name: 'Finance', value: 88, color: '#8B5CF6' }
];

const recentActivity = [
  { name: 'John Doe', time: '09:15 AM', status: 'Check In', location: 'Office - Main Building' },
  { name: 'Sarah Smith', time: '09:18 AM', status: 'Check In', location: 'Office - Annex' },
  { name: 'Mike Johnson', time: '09:22 AM', status: 'WFH', location: 'Remote' },
  { name: 'Emily Davis', time: '09:30 AM', status: 'Check In', location: 'Office - Main Building' },
  { name: 'David Wilson', time: '10:05 AM', status: 'Late', location: 'Office - Main Building' }
];

export function Attendance() {
  const stats = [
    {
      title: 'Total Present',
      value: '975',
      icon: <UserCheck className="w-6 h-6 text-green-600" />,
      change: '+2.5%',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Absent',
      value: '45',
      icon: <UserX className="w-6 h-6 text-red-600" />,
      change: '-1.2%',
      bgColor: 'bg-red-50'
    },
    {
      title: 'On Leave',
      value: '80',
      icon: <Calendar className="w-6 h-6 text-orange-600" />,
      change: '+0.8%',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Work From Home',
      value: '125',
      icon: <Home className="w-6 h-6 text-blue-600" />,
      change: '+15.3%',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Late Arrivals',
      value: '32',
      icon: <Clock className="w-6 h-6 text-yellow-600" />,
      change: '-5.6%',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Avg. Attendance',
      value: '82.5%',
      icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
      change: '+1.8%',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 mb-1">Attendance Dashboard</h1>
          <p className="text-sm text-gray-600">Track and manage employee attendance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Calendar className="w-4 h-4 mr-2" />
            View Calendar
          </Button>
          <Button>
            <Clock className="w-4 h-4 mr-2" />
            Mark Attendance
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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
              <p className="text-xs text-green-600">{stat.change} vs yesterday</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Attendance Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={weeklyAttendance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="#10B981" name="Present" />
                <Bar dataKey="absent" fill="#EF4444" name="Absent" />
                <Bar dataKey="leave" fill="#F59E0B" name="Leave" />
                <Bar dataKey="wfh" fill="#3B82F6" name="WFH" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department-wise Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>Department Attendance %</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={departmentAttendance}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentAttendance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#4F46E5] rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">{activity.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">{activity.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{activity.time}</span>
                        <MapPin className="w-3 h-3 text-gray-400 ml-2" />
                        <span className="text-xs text-gray-600">{activity.location}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={
                    activity.status === 'Check In' ? 'success' :
                    activity.status === 'WFH' ? 'info' : 'warning'
                  }>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'John Doe', type: 'Attendance Correction', date: 'Feb 13, 2026' },
                { name: 'Sarah Smith', type: 'Late Entry Approval', date: 'Feb 13, 2026' },
                { name: 'Mike Johnson', type: 'Out of Range', date: 'Feb 12, 2026' },
                { name: 'Emily Davis', type: 'Break Extension', date: 'Feb 12, 2026' },
                { name: 'David Wilson', type: 'Overtime Request', date: 'Feb 11, 2026' }
              ].map((request, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-900">{request.name}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{request.type}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{request.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary">Reject</Button>
                    <Button size="sm">Approve</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
