import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
    UserMinus, Calendar, FileText, CheckCircle, AlertTriangle, 
    Search, Briefcase, Shield, LogOut, Clock
} from 'lucide-react';

interface Resignation {
  _id: string;
  employeeId: {
      _id: string;
      name: string;
      department: string;
      designation: string;
      email: string;
      joiningDate: string;
  };
  reason: string;
  noticeDate: string;
  lastWorkingDay: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

interface OffboardingTask {
    assetReturns: boolean;
    knowledgeTransfer: boolean;
    accessRevocation: boolean;
    exitInterview: boolean;
    financeClearance: boolean;
}

export default function OffboardingList() {
  const [exits, setExits] = useState<Resignation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [selectedExit, setSelectedExit] = useState<Resignation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<OffboardingTask>({
      assetReturns: false,
      knowledgeTransfer: false,
      accessRevocation: false,
      exitInterview: false,
      financeClearance: false
  });

  useEffect(() => {
    fetchApprovedResignations();
  }, []);

  const fetchApprovedResignations = async () => {
    try {
        // In a real app, this might be a specific endpoint for 'offboarding-ready' users
        // For now, we reuse resignations and filter for 'Approved'
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user-management/resignations`, {
           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.data.success) {
            const approved = response.data.resignations.filter((r: Resignation) => r.status === 'Approved');
            setExits(approved);
        }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleOpenOffboard = (exit: Resignation) => {
      setSelectedExit(exit);
      setIsModalOpen(true);
      // Reset tasks
      setTasks({
          assetReturns: false,
          knowledgeTransfer: false,
          accessRevocation: false,
          exitInterview: false,
          financeClearance: false
      });
  };

  const handleCompleteOffboarding = async () => {
      if (!selectedExit) return;
      
      try {
          // 1. Update User Status to Inactive (Ex-Employee)
          await axios.put(`${import.meta.env.VITE_API_URL}/users/${selectedExit.employeeId._id}`, {
              status: 'Inactive',
              // We could also add 'exitDate': selectedExit.lastWorkingDay
          }, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });

          // 2. Update Resignation Status to 'Completed' (if API supports it, or just leave as Approved)
          // For now, we assume changing user status is the main goal.
          
          alert('Employee successfully offboarded and moved to Ex-Employees list.');
          setIsModalOpen(false);
          fetchApprovedResignations(); // Refresh list
      } catch (err) {
          console.error(err);
          alert('Failed to complete offboarding.');
      }
  };

  const toggleTask = (key: keyof OffboardingTask) => {
      setTasks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allTasksCompleted = Object.values(tasks).every(Boolean);

  const filteredExits = exits.filter(e => e.employeeId?.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 mt-4">
      <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <LogOut className="w-6 h-6 text-red-600" />
                Employee Offboarding
            </h1>
            <p className="text-gray-500 mt-1">Manage exit processes, clearances, and handover.</p>
          </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border-l-4 border-l-amber-500 shadow-sm">
               <div className="flex justify-between items-center">
                   <div>
                       <p className="text-gray-500 text-xs uppercase font-bold">Pending Exits</p>
                       <p className="text-2xl font-bold text-gray-800">{exits.length}</p>
                   </div>
                   <div className="p-2 bg-amber-50 rounded-full"><Clock className="w-5 h-5 text-amber-600" /></div>
               </div>
          </Card>
          <Card className="p-4 border-l-4 border-l-red-500 shadow-sm">
               <div className="flex justify-between items-center">
                   <div>
                       <p className="text-gray-500 text-xs uppercase font-bold">Asset Recovery</p>
                       <p className="text-2xl font-bold text-gray-800">Pending</p>
                   </div>
                   <div className="p-2 bg-red-50 rounded-full"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
               </div>
          </Card>
           <Card className="p-4 border-l-4 border-l-blue-500 shadow-sm">
               <div className="flex justify-between items-center">
                   <div>
                       <p className="text-gray-500 text-xs uppercase font-bold">Completed This Month</p>
                       <p className="text-2xl font-bold text-gray-800">0</p>
                   </div>
                   <div className="p-2 bg-blue-50 rounded-full"><CheckCircle className="w-5 h-5 text-blue-600" /></div>
               </div>
          </Card>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
         <div className="p-4 border-b flex gap-4">
             <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                      type="text" 
                      placeholder="Search employees..."
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
                     <th className="px-6 py-3">Department</th>
                     <th className="px-6 py-3">Last Working Day</th>
                     <th className="px-6 py-3">Exit Type</th>
                     <th className="px-6 py-3 text-right">Action</th>
                 </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
                 {filteredExits.map(exit => (
                     <tr key={exit._id} className="hover:bg-gray-50">
                         <td className="px-6 py-4">
                             <div className="font-medium text-gray-900">{exit.employeeId?.name || 'Unknown'}</div>
                             <div className="text-xs text-gray-400">{exit.employeeId?.email}</div>
                         </td>
                         <td className="px-6 py-4">
                             <div className="text-gray-900">{exit.employeeId?.department}</div>
                             <div className="text-xs text-gray-400">{exit.employeeId?.designation}</div>
                         </td>
                         <td className="px-6 py-4 font-medium text-amber-700">
                             {new Date(exit.lastWorkingDay).toLocaleDateString()}
                         </td>
                         <td className="px-6 py-4">
                             <span className="px-2 py-1 bg-red-50 text-red-700 rounded-full text-xs font-semibold border border-red-100">Resignation</span>
                         </td>
                         <td className="px-6 py-4 text-right">
                             <Button size="sm" variant="danger" onClick={() => handleOpenOffboard(exit)}>
                                 Process Exit
                             </Button>
                         </td>
                     </tr>
                 ))}
                 {filteredExits.length === 0 && (
                     <tr><td colSpan={5} className="text-center py-8 text-gray-400">No pending offboarding requests found.</td></tr>
                 )}
             </tbody>
         </table>
      </div>

      {/* OFFBOARDING MODAL */}
      {isModalOpen && selectedExit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col animate-in zoom-in-95">
                  <div className="p-6 border-b flex justify-between items-start bg-red-50 rounded-t-xl">
                      <div>
                          <h2 className="text-xl font-bold text-red-900">Finalize Offboarding</h2>
                          <p className="text-sm text-red-700 mt-1">{selectedExit.employeeId?.name}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>✕</Button>
                  </div>

                  <div className="p-6 space-y-6">
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                          <div className="text-sm text-amber-800">
                              <p className="font-semibold">Confirm Action</p>
                              <p>This will deactivate the user account and move them to the Ex-Employee records. Ensure all clearances are obtained.</p>
                          </div>
                      </div>

                      <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Clearance Checklist</h3>
                          
                          <div className="space-y-2">
                             {[
                                 { key: 'assetReturns', label: 'Assets Returned (Laptop, ID Card, etc.)' },
                                 { key: 'knowledgeTransfer', label: 'Knowledge Transfer (KT) Completed' },
                                 { key: 'accessRevocation', label: 'System Access Revoked' },
                                 { key: 'financeClearance', label: 'No Dues / Finance Clearance' },
                                 { key: 'exitInterview', label: 'Exit Interview Conducted' },
                             ].map((item) => (
                                 <div key={item.key} 
                                      onClick={() => toggleTask(item.key as any)}
                                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                          (tasks as any)[item.key] ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'
                                      }`}
                                 >
                                     <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                         (tasks as any)[item.key] ? 'bg-green-500 border-green-500' : 'border-gray-300 bg-white'
                                     }`}>
                                         {(tasks as any)[item.key] && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                     </div>
                                     <span className={(tasks as any)[item.key] ? 'text-green-900 font-medium' : 'text-gray-700'}>{item.label}</span>
                                 </div>
                             ))}
                          </div>
                      </div>
                  </div>
                  
                  <div className="p-6 border-t bg-gray-50 rounded-b-xl flex justify-end gap-3">
                       <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                       <Button 
                           variant="danger"
                           onClick={handleCompleteOffboarding}
                           disabled={!allTasksCompleted}
                       >
                           Complete Exit & Deactivate
                       </Button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
