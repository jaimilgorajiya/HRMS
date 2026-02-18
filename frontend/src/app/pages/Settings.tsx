import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Building2, Clock, Calendar, DollarSign, MapPin, Shield, Bell } from 'lucide-react';

export function Settings() {
  const settingsSections = [
    {
      title: 'Company Settings',
      icon: <Building2 className="w-5 h-5 text-[#4F46E5]" />,
      description: 'Basic company information and configuration',
      fields: [
        { label: 'Company Name', value: 'Acme Corporation' },
        { label: 'Company Email', value: 'info@acmecorp.com' },
        { label: 'Company Phone', value: '+1 234-567-8900' },
        { label: 'Address', value: '123 Business Street, Suite 100' }
      ]
    },
    {
      title: 'Attendance Settings',
      icon: <Clock className="w-5 h-5 text-green-600" />,
      description: 'Configure attendance tracking and policies',
      fields: [
        { label: 'Check-in Time', value: '09:00 AM' },
        { label: 'Check-out Time', value: '06:00 PM' },
        { label: 'Grace Period', value: '15 minutes' },
        { label: 'Half Day Hours', value: '4 hours' }
      ]
    },
    {
      title: 'Leave Settings',
      icon: <Calendar className="w-5 h-5 text-orange-600" />,
      description: 'Manage leave types and policies',
      fields: [
        { label: 'Casual Leave', value: '12 days/year' },
        { label: 'Sick Leave', value: '10 days/year' },
        { label: 'Earned Leave', value: '15 days/year' },
        { label: 'Carry Forward', value: 'Enabled' }
      ]
    },
    {
      title: 'Payroll Settings',
      icon: <DollarSign className="w-5 h-5 text-blue-600" />,
      description: 'Configure salary structure and payment',
      fields: [
        { label: 'Payment Cycle', value: 'Monthly' },
        { label: 'Salary Day', value: 'Last working day' },
        { label: 'Tax Deduction', value: 'Automatic' },
        { label: 'PF Contribution', value: '12%' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 mb-1">Company Settings</h1>
          <p className="text-sm text-gray-600">Manage your organization's configuration</p>
        </div>
        <Button>
          Save Changes
        </Button>
      </div>

      {/* Quick Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Shifts', icon: <Clock className="w-5 h-5" />, value: '3 Active', color: 'bg-blue-50 text-blue-600' },
          { title: 'Locations', icon: <MapPin className="w-5 h-5" />, value: '8 Branches', color: 'bg-green-50 text-green-600' },
          { title: 'Roles', icon: <Shield className="w-5 h-5" />, value: '15 Defined', color: 'bg-purple-50 text-purple-600' },
          { title: 'Notifications', icon: <Bell className="w-5 h-5" />, value: 'All Active', color: 'bg-orange-50 text-orange-600' }
        ].map((item, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5">
              <div className={`p-3 rounded-lg ${item.color} inline-flex mb-3`}>
                {item.icon}
              </div>
              <p className="text-sm text-gray-600 mb-1">{item.title}</p>
              <p className="text-lg text-gray-900">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingsSections.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  {section.icon}
                </div>
                <div>
                  <CardTitle>{section.title}</CardTitle>
                  <p className="text-xs text-gray-600 mt-0.5">{section.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.fields.map((field, fieldIndex) => (
                  <div key={fieldIndex}>
                    <label className="block text-sm text-gray-700 mb-1.5">
                      {field.label}
                    </label>
                    <Input value={field.value} />
                  </div>
                ))}
                <Button variant="secondary" size="sm" className="w-full mt-2">
                  Update Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm text-gray-900">Security Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-900">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-600">Add extra security layer</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4F46E5]"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-900">IP Restriction</p>
                    <p className="text-xs text-gray-600">Limit access by IP address</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4F46E5]"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-900">Session Timeout</p>
                    <p className="text-xs text-gray-600">Auto logout after inactivity</p>
                  </div>
                  <Select
                    options={[
                      { value: '15', label: '15 minutes' },
                      { value: '30', label: '30 minutes' },
                      { value: '60', label: '1 hour' }
                    ]}
                    className="w-32"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm text-gray-900">Notification Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-900">Email Notifications</p>
                    <p className="text-xs text-gray-600">Send email alerts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4F46E5]"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-900">SMS Notifications</p>
                    <p className="text-xs text-gray-600">Send SMS alerts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4F46E5]"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-900">Push Notifications</p>
                    <p className="text-xs text-gray-600">Browser push alerts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4F46E5]"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
