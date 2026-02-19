import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
    User, Mail, Calendar, FileText, Download, CheckCircle, XCircle, 
    Printer, Search, Briefcase, DollarSign, Clock, Shield, Filter,
    ChevronDown, Eye, Lock
} from 'lucide-react';
import Swal from 'sweetalert2';

interface ExEmployee {
  _id: string;
  name: string;
  email: string;
  designation: string;
  position?: string;
  department: string;
  joiningDate?: string;
  exitDate?: string;
  exitReason?: string;
  status: 'Resigned' | 'Terminated' | 'Absconding' | 'Inactive' | 'Retired';
  settlementStatus?: 'Pending' | 'Paid' | 'Settled';
  paymentStatus?: 'Pending' | 'Paid';
  settlementAmount?: number;
  documentsIssued?: {
      experienceLetter: boolean;
      relievingLetter: boolean;
  };
  departmentClearance?: {
      it: boolean;
      hr: boolean;
      finance: boolean;
      admin: boolean;
      manager: boolean;
  };
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
  
  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [settlementFilter, setSettlementFilter] = useState('');

  // Values for Dropdowns
  const [departments, setDepartments] = useState<string[]>([]);

  // Modal State
  const [selectedEmp, setSelectedEmp] = useState<ExEmployee | null>(null);
  const [exitRecord, setExitRecord] = useState<ExitRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingRecord, setLoadingRecord] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'exit' | 'settlement' | 'documents'>('overview');

  useEffect(() => {
    fetchExEmployees();
  }, []);

  const fetchExEmployees = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user-management/ex-employees`, {
         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) {
          const emps = response.data.exEmployees;
          setEmployees(emps);
          const depts = Array.from(new Set(emps.map((e: ExEmployee) => e.department))).filter(Boolean) as string[];
          setDepartments(depts);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // Derived State & Filtering
  const filteredEmployees = employees.filter(emp => {
      const matchesSearch = (emp.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                            (emp.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchesDept = departmentFilter ? emp.department === departmentFilter : true;
      const matchesStatus = statusFilter ? emp.status === statusFilter : true;
      const matchesSettlement = settlementFilter ? (emp.paymentStatus || 'Pending') === settlementFilter : true;
      return matchesSearch && matchesDept && matchesStatus && matchesSettlement;
  });

  // Dashboard Stats
  const stats = {
      total: employees.length,
      exitsThisYear: employees.filter(e => e.exitDate && new Date(e.exitDate).getFullYear() === new Date().getFullYear()).length,
      pendingSettlements: employees.filter(e => e.paymentStatus === 'Pending').length,
      fullySettled: employees.filter(e => e.paymentStatus === 'Paid').length
  };

  const handleViewDetails = async (emp: ExEmployee) => {
      setSelectedEmp(emp);
      setActiveTab('overview');
      setIsModalOpen(true);
      setLoadingRecord(true);
      try {
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

  const generateDocument = (type: 'Experience' | 'Relieving') => {
      if(!selectedEmp || !exitRecord) return;
      const content = `
        ${type.toUpperCase()} LETTER
        Date: ${new Date().toLocaleDateString()}
        To, ${selectedEmp.name}
        
        This certifies that ${selectedEmp.name} worked from ${selectedEmp.joiningDate ? new Date(selectedEmp.joiningDate).toLocaleDateString() : 'N/A'} to ${exitRecord.exitDate ? new Date(exitRecord.exitDate).toLocaleDateString() : 'N/A'}.
        We wish them success.
        
        Admin Department
      `;
      const win = window.open('', '_blank');
      win?.document.write(`<pre style="font-family:serif;padding:40px;">${content}</pre>`);
      win?.print();
  };

  const exportToCSV = () => {
      const headers = ['Name', 'Email', 'Department', 'Designation', 'Join Date', 'Exit Date', 'Status', 'Settlement Status'];
      const rows = filteredEmployees.map(e => [
          e.name, e.email, e.department, e.designation, 
          e.joiningDate ? new Date(e.joiningDate).toLocaleDateString() : '-',
          e.exitDate ? new Date(e.exitDate).toLocaleDateString() : '-',
          e.status,
          e.paymentStatus || 'Pending'
      ]);
      
      const csvContent = "data:text/csv;charset=utf-8," 
          + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "ex_employees_archive.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const statusBadgeColor = (status: string) => {
      switch(status) {
          case 'Resigned': return 'bg-amber-100 text-amber-800 border-amber-200';
          case 'Terminated': return 'bg-red-100 text-red-800 border-red-200';
          case 'Retired': return 'bg-blue-100 text-blue-800 border-blue-200';
          default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-6 h-6 text-gray-700" />
                Ex-Employee Archive
            </h1>
            <p className="text-gray-500 mt-1">Secure repository of past employee records and exit documentation.</p>
          </div>
          <Button variant="outline" onClick={exportToCSV} className="gap-2">
              <Download className="w-4 h-4" /> Export Archive
          </Button>
      </div>

      {/* DASHBOARD STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
              { label: 'Total Archived', value: stats.total, icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Exits This Year', value: stats.exitsThisYear, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Pending Settlements', value: stats.pendingSettlements, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Fully Settled', value: stats.fullySettled, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
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

      {/* FILTERS */}
      <Card className="p-4 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                      type="text" 
                      placeholder="Search archive..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                <select 
                    className="px-4 py-2 border rounded-lg text-sm bg-white outline-none cursor-pointer"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                    <option value="">All Departments</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select 
                    className="px-4 py-2 border rounded-lg text-sm bg-white outline-none cursor-pointer"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All Exit Types</option>
                    <option value="Resigned">Resigned</option>
                    <option value="Terminated">Terminated</option>
                    <option value="Retired">Retired</option>
                </select>
                <select 
                    className="px-4 py-2 border rounded-lg text-sm bg-white outline-none cursor-pointer"
                    value={settlementFilter}
                    onChange={(e) => setSettlementFilter(e.target.value)}
                >
                    <option value="">Settlement Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                </select>
                <Button variant="secondary" onClick={() => { setSearchTerm(''); setDepartmentFilter(''); setStatusFilter(''); setSettlementFilter(''); }}>
                    Reset
                </Button>
              </div>
          </div>
      </Card>
                    
      {/* TABLE */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
         <div className="overflow-x-auto">
             <table className="w-full text-sm text-left text-gray-500">
                 <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-xs border-b">
                     <tr>
                         <th className="px-6 py-3">Employee</th>
                         <th className="px-6 py-3">Role</th>
                         <th className="px-6 py-3">Tenure</th>
                         <th className="px-6 py-3">Status</th>
                         <th className="px-6 py-3">Settlement</th>
                         <th className="px-6 py-3 text-right">Actions</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                     {filteredEmployees.map(emp => (
                         <tr key={emp._id} className="hover:bg-gray-50 transition-colors">
                             <td className="px-6 py-4">
                                 <div className="font-medium text-gray-900">{emp.name}</div>
                                 <div className="text-xs text-gray-400">{emp.email}</div>
                             </td>
                             <td className="px-6 py-4">
                                 <div className="text-gray-900">{emp.designation || emp.position || '-'}</div>
                                 <div className="text-xs text-gray-400">{emp.department}</div>
                             </td>
                             <td className="px-6 py-4">
                                 <div className="text-xs space-y-1">
                                    <div className="flex items-center gap-1"><span className="w-8 text-gray-400">Join:</span> {emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : '-'}</div>
                                    <div className="flex items-center gap-1"><span className="w-8 text-gray-400">Exit:</span> <span className="text-red-600 font-medium">{emp.exitDate ? new Date(emp.exitDate).toLocaleDateString() : '-'}</span></div>
                                 </div>
                             </td>
                             <td className="px-6 py-4">
                                 <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadgeColor(emp.status)}`}>
                                     {emp.status}
                                 </span>
                             </td>
                             <td className="px-6 py-4">
                                 <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${emp.paymentStatus === 'Paid' ? 'bg-green-500' : 'bg-amber-500'}`} />
                                    <span>{emp.paymentStatus || 'Pending'}</span>
                                 </div>
                             </td>
                             <td className="px-6 py-4 text-right">
                                 <Button size="sm" variant="secondary" onClick={() => handleViewDetails(emp)} className="gap-2">
                                     <Eye className="w-4 h-4" /> View
                                 </Button>
                             </td>
                         </tr>
                     ))}
                     {filteredEmployees.length === 0 && !loading && (
                         <tr><td colSpan={6} className="text-center py-12 text-gray-400">No archival records found matching criteria.</td></tr>
                     )}
                 </tbody>
             </table>
         </div>
      </div>

      {/* DETAILS MODAL */}
      {isModalOpen && selectedEmp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in zoom-in-95">
                  {/* Modal Header */}
                  <div className="p-6 border-b flex justify-between items-start bg-gray-50 rounded-t-xl">
                      <div>
                          <h2 className="text-2xl font-bold text-gray-900">{selectedEmp.name}</h2>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <span>{selectedEmp.designation}</span>
                              <span>•</span>
                              <span>{selectedEmp.department}</span>
                              <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-xs font-medium uppercase ml-2 flex items-center gap-1">
                                  <Lock className="w-3 h-3" /> Archived
                              </span>
                          </div>
                      </div>
                      <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                          <XCircle className="w-8 h-8" />
                      </button>
                  </div>

                  {/* Tabs */}
                  <div className="border-b px-6 flex gap-6">
                      {['overview', 'exit', 'settlement', 'documents'].map(tab => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`py-4 text-sm font-medium border-b-2 transition-colors capitalize ${
                                activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            {tab}
                          </button>
                      ))}
                  </div>

                  {/* Modal Content */}
                  <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                      {loadingRecord ? (
                          <div className="flex items-center justify-center h-40 text-gray-500">Loading archive data...</div>
                      ) : exitRecord ? (
                        <div className="space-y-6">
                            
                            {/* OVERVIEW TAB */}
                            {activeTab === 'overview' && (
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-xs uppercase text-gray-400 font-semibold">Email Address</label>
                                        <p className="font-medium text-gray-900">{selectedEmp.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs uppercase text-gray-400 font-semibold">Department</label>
                                        <p className="font-medium text-gray-900">{selectedEmp.department}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs uppercase text-gray-400 font-semibold">Join Date</label>
                                        <p className="font-medium text-gray-900">{selectedEmp.joiningDate ? new Date(selectedEmp.joiningDate).toDateString() : '-'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs uppercase text-gray-400 font-semibold">Exit Date</label>
                                        <p className="font-medium text-red-600">{exitRecord.exitDate ? new Date(exitRecord.exitDate).toDateString() : '-'}</p>
                                    </div>
                                    <div className="col-span-2 mt-4 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                                        <h4 className="font-semibold text-yellow-800 mb-2">Rehire Eligibility</h4>
                                        <p className="text-sm text-yellow-700">
                                            {selectedEmp.status === 'Terminated' || selectedEmp.status === 'Absconding' 
                                                ? 'Not Eligible for Rehire based on exit type.' 
                                                : 'Eligible for Rehire subject to approval.'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* EXIT DETAILS TAB */}
                            {activeTab === 'exit' && (
                                <div className="space-y-6">
                                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Exit Reason</h3>
                                        <p className="text-gray-600 italic">"{exitRecord.reason || 'No reason recorded'}"</p>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Department Clearance</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {Object.entries(exitRecord.departmentClearance || {}).map(([dept, cleared]) => (
                                                <div key={dept} className={`flex items-center justify-between p-3 rounded-lg border ${cleared ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                                    <span className="capitalize text-sm font-medium text-gray-700">{dept}</span>
                                                    {cleared ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Clock className="w-5 h-5 text-gray-400" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SETTLEMENT TAB */}
                            {activeTab === 'settlement' && (
                                <div className="bg-white p-6 rounded-lg border shadow-sm text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                                        <DollarSign className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">Full & Final Settlement</h3>
                                    <p className="text-4xl font-bold text-gray-900 mt-2">${exitRecord.fullAndFinal?.settlementAmount || 0}</p>
                                    <div className="mt-6 flex justify-center gap-4">
                                        <div className="text-center px-6 py-2 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500 uppercase">Status</p>
                                            <p className={`font-semibold ${exitRecord.fullAndFinal?.paymentStatus === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}>
                                                {exitRecord.fullAndFinal?.paymentStatus || 'Pending'}
                                            </p>
                                        </div>
                                        {exitRecord.fullAndFinal?.paymentDate && (
                                            <div className="text-center px-6 py-2 bg-gray-50 rounded-lg">
                                                <p className="text-xs text-gray-500 uppercase">Paid Date</p>
                                                <p className="font-semibold text-gray-900">
                                                    {new Date(exitRecord.fullAndFinal.paymentDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* DOCUMENTS TAB */}
                            {activeTab === 'documents' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { name: 'Experience Letter', issued: exitRecord.documentsIssued?.experienceLetter, type: 'Experience' },
                                        { name: 'Relieving Letter', issued: exitRecord.documentsIssued?.relievingLetter, type: 'Relieving' }
                                    ].map((doc) => (
                                        <div key={doc.name} className="p-4 bg-white border rounded-lg flex justify-between items-center shadow-sm">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-5 h-5 text-blue-600" />
                                                    <span className="font-medium text-gray-900">{doc.name}</span>
                                                </div>
                                                <span className={`text-xs ml-7 ${doc.issued ? 'text-green-600' : 'text-amber-600'}`}>
                                                    {doc.issued ? '● Issued & Archived' : '○ Not Generated'}
                                                </span>
                                            </div>
                                            {doc.issued && (
                                                <Button size="sm" variant="secondary" onClick={() => generateDocument(doc.type as any)}>
                                                    <Printer className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <div className="p-4 bg-gray-50 border border-dashed rounded-lg flex items-center justify-center text-gray-500 text-sm">
                                        No other documents archived.
                                    </div>
                                </div>
                            )}

                        </div>
                      ) : (
                          <div className="text-center py-20 text-red-500">Record not found or access denied.</div>
                      )}
                  </div>
                  <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end">
                      <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Close Archive</Button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
