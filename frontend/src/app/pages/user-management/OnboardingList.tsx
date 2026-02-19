import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
    User, FileText, CheckCircle, Clock, Search, 
    UserPlus
} from 'lucide-react';
import UserForm from '../UserForm';

interface OnboardingEmployee {
  _id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  joiningDate?: string;
  onboardingStatus: 'Pre-Boarding' | 'Pending Documents' | 'IT Setup' | 'Induction' | 'Completed';
  checklistProgress: number;
}

export default function OnboardingList() {
  const [employees, setEmployees] = useState<OnboardingEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [selectedEmp, setSelectedEmp] = useState<OnboardingEmployee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchNewJoiners();
  }, []);

  const fetchNewJoiners = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user-management/new-joiners`, {
         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) {
          setEmployees(response.data.newJoiners);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleResume = (emp: OnboardingEmployee) => {
      setSelectedEmp(emp);
      setIsModalOpen(true);
  };

  const stats = {
      total: employees.length,
      preBoarding: employees.filter(e => e.onboardingStatus === 'Pre-Boarding').length,
      pendingDocs: employees.filter(e => e.onboardingStatus === 'Pending Documents').length,
      inductionReady: employees.filter(e => e.onboardingStatus === 'Induction').length
  };

  const filteredEmployees = employees.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 mt-4">
      <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-blue-600" />
                Onboarding Pipeline
            </h1>
            <p className="text-gray-500 mt-1">Manage new hires and complete their profiles.</p>
          </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
              { label: 'New Hires', value: stats.total, icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Pre-Boarding', value: stats.preBoarding, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Pending Docs', value: stats.pendingDocs, icon: FileText, color: 'text-red-600', bg: 'bg-red-50' },
              { label: 'Ready for Induction', value: stats.inductionReady, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          ].map((stat, idx) => (
              <Card key={idx} className="p-4 flex items-center justify-between shadow-sm border border-gray-100">
                  <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bg}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
              </Card>
          ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
         <div className="p-4 border-b flex gap-4">
             <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                      type="text" 
                      placeholder="Search new joiners..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
             </div>
         </div>
         <table className="w-full text-sm text-left text-gray-500">
             <thead className="bg-gray-50 text-gray-700 uppercase font-medium">
                 <tr>
                     <th className="px-6 py-3">Employee</th>
                     <th className="px-6 py-3">Role</th>
                     <th className="px-6 py-3">Joining Date</th>
                     <th className="px-6 py-3">Status</th>
                     <th className="px-6 py-3 text-right">Action</th>
                 </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
                 {filteredEmployees.map(emp => (
                     <tr key={emp._id} className="hover:bg-gray-50">
                         <td className="px-6 py-4">
                             <div className="font-medium text-gray-900">{emp.name}</div>
                             <div className="text-xs text-gray-400">{emp.email}</div>
                         </td>
                         <td className="px-6 py-4">
                             <div className="text-gray-900">{emp.designation}</div>
                             <div className="text-xs text-gray-400">{emp.department}</div>
                         </td>
                         <td className="px-6 py-4">
                             {emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : 'Not Set'}
                         </td>
                         <td className="px-6 py-4">
                             <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                ${emp.onboardingStatus === 'Completed' ? 'bg-green-100 text-green-800' : 
                                  emp.onboardingStatus === 'Pending Documents' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                 {emp.onboardingStatus}
                             </span>
                         </td>
                         <td className="px-6 py-4 text-right">
                             <Button size="sm" onClick={() => handleResume(emp)}>
                                 Resume / Edit Form
                             </Button>
                         </td>
                     </tr>
                 ))}
             </tbody>
         </table>
      </div>

      {/* EDIT USER FORM MODAL */}
      {isModalOpen && selectedEmp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
              <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl animate-in zoom-in-95 my-8">
                  <div className="absolute top-4 right-4 z-10">
                      <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>✕ Close</Button>
                  </div>
                  <div className="p-2 max-h-[85vh] overflow-y-auto rounded-xl custom-scrollbar">
                       <UserForm 
                           userId={selectedEmp._id} 
                           onClose={() => { setIsModalOpen(false); fetchNewJoiners(); }} 
                           isModal={true} 
                       />
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
