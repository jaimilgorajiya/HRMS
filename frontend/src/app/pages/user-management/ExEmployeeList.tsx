import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input'; // Assuming input exists or I use native input/textarea
import { User, Mail, Calendar, FileText, Download, CheckCircle, XCircle, Printer } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

interface ExEmployee {
  _id: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  joiningDate?: string;
  exitDate?: string;
  status: 'Resigned' | 'Terminated' | 'Absconding' | 'Inactive';
}

interface ExitRecord {
    _id?: string;
    userId: string;
    exitDate: string;
    reason: string;
    status: 'Pending Clearance' | 'Cleared' | 'Settled';
    departmentClearance: {
        it: boolean;
        hr: boolean;
        finance: boolean;
        admin: boolean;
        manager: boolean;
    };
    fullAndFinal: {
        settlementAmount: number;
        paymentStatus: 'Pending' | 'Paid';
        paymentDate?: string;
    };
    documentsIssued: {
        experienceLetter: boolean;
        relievingLetter: boolean;
    };
}

export default function ExEmployeeList() {
  const [employees, setEmployees] = useState<ExEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedEmp, setSelectedEmp] = useState<ExEmployee | null>(null);
  const [exitRecord, setExitRecord] = useState<ExitRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingRecord, setLoadingRecord] = useState(false);

  useEffect(() => {
    fetchExEmployees();
  }, []);

  const fetchExEmployees = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user-management/ex-employees`, {
         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) setEmployees(response.data.exEmployees);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleManageExit = async (emp: ExEmployee) => {
      setSelectedEmp(emp);
      setIsModalOpen(true);
      setLoadingRecord(true);
      try {
          // Fetch or Create default
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/user-management/exit-record/${emp._id}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          if (response.data.success) {
              setExitRecord(response.data.exitRecord);
          }
      } catch (err) {
          console.error("Error fetching exit record", err);
      } finally {
          setLoadingRecord(false);
      }
  };

  const updateExitRecord = async (updates: Partial<ExitRecord>) => {
      if (!exitRecord || !selectedEmp) return;
      
      const updatedRecord = { ...exitRecord, ...updates };
      setExitRecord(updatedRecord as ExitRecord); // Optimistic update

      try {
          await axios.put(`${import.meta.env.VITE_API_URL}/user-management/exit-record/${selectedEmp._id}`, updatedRecord, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
      } catch (err) {
          console.error("Error updating exit record", err);
          // Revert or show error (simplified)
      }
  };

  const handleClearanceToggle = (dept: keyof ExitRecord['departmentClearance']) => {
      if (!exitRecord) return;
      const newClearance = { ...exitRecord.departmentClearance, [dept]: !exitRecord.departmentClearance[dept] };
      updateExitRecord({ departmentClearance: newClearance });
  };
  
  const generateDocument = (type: 'Experience' | 'Relieving') => {
      if(!selectedEmp || !exitRecord) return;
      
      const content = `
        ${type.toUpperCase()} LETTER
        
        Date: ${new Date().toLocaleDateString()}
        
        To,
        ${selectedEmp.name}
        ${selectedEmp.designation}
        
        This is to certify that ${selectedEmp.name} was employed with us from ${selectedEmp.joiningDate ? new Date(selectedEmp.joiningDate).toLocaleDateString() : 'Unknown'} to ${exitRecord.exitDate ? new Date(exitRecord.exitDate).toLocaleDateString() : 'Unknown'}.
        
        During their tenure, we found them to be professional and sincere. We wish them success in future endeavors.
        
        Sincerely,
        HR Department
      `;
      
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`<pre style="font-family: serif; font-size: 14px; white-space: pre-wrap; padding: 40px;">${content}</pre>`);
        newWindow.document.close();
        newWindow.print();
        
        // Mark as issued
        if (type === 'Experience') updateExitRecord({ documentsIssued: { ...exitRecord.documentsIssued, experienceLetter: true }});
        if (type === 'Relieving') updateExitRecord({ documentsIssued: { ...exitRecord.documentsIssued, relievingLetter: true }});
      }
  };

  const statusColor = (status: string) => {
      switch(status) {
          case 'Resigned': return 'bg-yellow-100 text-yellow-800';
          case 'Terminated': return 'bg-red-100 text-red-800';
          case 'Absconding': return 'bg-gray-100 text-gray-800';
          default: return 'bg-gray-100 text-gray-600';
      }
  };

  return (
    <div className="space-y-6 mt-4 relative">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ex-Employees</h1>
        <p className="text-gray-500">Archive of past employees and exit records.</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
         <table className="w-full text-sm text-left text-gray-500">
             <thead className="bg-gray-50 text-gray-700 uppercase font-medium">
                 <tr>
                     <th className="px-6 py-3">Name</th>
                     <th className="px-6 py-3">Designation</th>
                     <th className="px-6 py-3">Department</th>
                     <th className="px-6 py-3">Dates</th>
                     <th className="px-6 py-3">Status</th>
                     <th className="px-6 py-3">Actions</th>
                 </tr>
             </thead>
             <tbody>
                 {employees.map(emp => (
                     <tr key={emp._id} className="border-b hover:bg-gray-50">
                         <td className="px-6 py-4 font-medium text-gray-900">
                             <div>{emp.name}</div>
                             <div className="text-xs text-gray-400">{emp.email}</div>
                         </td>
                         <td className="px-6 py-4">{emp.designation}</td>
                         <td className="px-6 py-4">{emp.department}</td>
                         <td className="px-6 py-4">
                             <div className="text-xs">
                                 <div>Join: {emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : '-'}</div>
                                 <div>Exit: {emp.exitDate ? new Date(emp.exitDate).toLocaleDateString() : '-'}</div>
                             </div>
                         </td>
                         <td className="px-6 py-4">
                             <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(emp.status)}`}>
                                 {emp.status}
                             </span>
                         </td>
                         <td className="px-6 py-4">
                             <Button size="sm" variant="outline" onClick={() => handleManageExit(emp)}>
                                 Manage Exit
                             </Button>
                         </td>
                     </tr>
                 ))}
                 {employees.length === 0 && !loading && (
                     <tr><td colSpan={6} className="text-center py-10 text-gray-400">No ex-employee records found.</td></tr>
                 )}
             </tbody>
         </table>
      </div>

      {/* EXIT MANAGEMENT MODAL */}
      {isModalOpen && selectedEmp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
                  <div className="p-6 border-b flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                      <div>
                          <h2 className="text-xl font-bold text-gray-900">Exit Management: {selectedEmp.name}</h2>
                          <p className="text-sm text-gray-500">{selectedEmp.designation} • {selectedEmp.department}</p>
                      </div>
                      <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                          <span className="sr-only">Close</span>
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                      </button>
                  </div>

                  {loadingRecord ? (
                      <div className="p-20 text-center text-gray-500">Loading exit details...</div>
                  ) : exitRecord ? (
                      <div className="p-6 space-y-8">
                          
                          {/* 1. CLEARANCE CHECKLIST */}
                          <section>
                              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                                  <CheckCircle className="w-5 h-5 text-blue-600" />
                                  Department Clearance
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  {Object.entries(exitRecord.departmentClearance).map(([dept, cleared]) => (
                                      <div key={dept} 
                                           onClick={() => handleClearanceToggle(dept as any)}
                                           className={`cursor-pointer p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                                              cleared ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-blue-300'
                                           }`}
                                      >
                                          <span className="capitalize font-medium text-gray-700">{dept.replace(/([A-Z])/g, ' $1').trim()}</span>
                                          {cleared ? <CheckCircle className="w-5 h-5 text-green-600" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                                      </div>
                                  ))}
                              </div>
                          </section>

                          {/* 2. F&F SETTLEMENT */}
                          <section className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                                  <Download className="w-5 h-5 text-blue-600" />
                                  Full & Final Settlement
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Settlement Amount</label>
                                      <div className="relative">
                                          <span className="absolute left-3 top-2 text-gray-500">$</span>
                                          <input 
                                              type="number" 
                                              className="pl-8 w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                              value={exitRecord.fullAndFinal.settlementAmount}
                                              onChange={(e) => updateExitRecord({ 
                                                  fullAndFinal: { ...exitRecord.fullAndFinal, settlementAmount: Number(e.target.value) } 
                                              })}
                                          />
                                      </div>
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                      <div className="flex gap-2">
                                          <Button 
                                              variant={exitRecord.fullAndFinal.paymentStatus === 'Paid' ? 'primary' : 'secondary'}
                                              onClick={() => updateExitRecord({ 
                                                  fullAndFinal: { ...exitRecord.fullAndFinal, paymentStatus: 'Paid', paymentDate: new Date().toISOString() },
                                                  status: 'Settled'
                                              })}
                                              className="flex-1"
                                          >
                                              {exitRecord.fullAndFinal.paymentStatus === 'Paid' ? 'Paid' : 'Mark as Paid'}
                                          </Button>
                                          <Button 
                                            variant="secondary"
                                            onClick={() => updateExitRecord({ 
                                                fullAndFinal: { ...exitRecord.fullAndFinal, paymentStatus: 'Pending', paymentDate: undefined },
                                                status: 'Pending Clearance'
                                            })}
                                          >
                                              Pending
                                          </Button>
                                      </div>
                                  </div>
                              </div>
                          </section>

                          {/* 3. DOCUMENT GENERATION */}
                          <section>
                              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                                  <FileText className="w-5 h-5 text-blue-600" />
                                  Exit Documents
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Card className="p-4 flex justify-between items-center">
                                      <div>
                                          <p className="font-medium">Experience Letter</p>
                                          <p className="text-xs text-gray-500">
                                              {exitRecord.documentsIssued.experienceLetter ? 'Issued' : 'Not Issued'}
                                          </p>
                                      </div>
                                      <Button variant="outline" size="sm" onClick={() => generateDocument('Experience')}>
                                          <Printer className="w-4 h-4 mr-2" />
                                          Print
                                      </Button>
                                  </Card>
                                  <Card className="p-4 flex justify-between items-center">
                                      <div>
                                          <p className="font-medium">Relieving Letter</p>
                                          <p className="text-xs text-gray-500">
                                              {exitRecord.documentsIssued.relievingLetter ? 'Issued' : 'Not Issued'}
                                          </p>
                                      </div>
                                      <Button variant="outline" size="sm" onClick={() => generateDocument('Relieving')}>
                                          <Printer className="w-4 h-4 mr-2" />
                                          Print
                                      </Button>
                                  </Card>
                              </div>
                          </section>

                      </div>
                  ) : (
                      <div className="p-10 text-center text-red-500">Failed to load exit details</div>
                  )}
                  
                  <div className="p-6 border-t bg-gray-50 flex justify-end">
                      <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
