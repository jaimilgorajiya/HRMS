import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Edit, Trash2, ArrowUpCircle } from 'lucide-react';

interface Resignation {
  _id: string;
  employeeId: {
      _id: string;
      name: string;
      department: string;
  };
  reason: string;
  noticeDate: string;
  lastWorkingDay: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  comments: string;
}

export default function ResignationList() {
  const [resignations, setResignations] = useState<Resignation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
      employeeId: '',
      reason: '',
      noticeDate: new Date().toISOString().split('T')[0],
      comments: ''
  });

  useEffect(() => {
      fetchResignations();
  }, []);

  const fetchResignations = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user-management/resignations`, {
           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.data.success) setResignations(response.data.resignations);
    } catch (err) { console.error(err); }
  };

  const calculateLastWorkingDay = (noticeDate: string) => {
      const date = new Date(noticeDate);
      date.setDate(date.getDate() + 30); // Assume 30 days notice
      return date.toISOString().split('T')[0];
  };

  const handleCreate = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          await axios.post(`${import.meta.env.VITE_API_URL}/user-management/resignations`, formData, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setIsModalOpen(false);
          fetchResignations();
      } catch (err) { console.error(err); }
  };

  const handleStatusChange = async (id: string, status: string) => {
      try {
          await axios.put(`${import.meta.env.VITE_API_URL}/user-management/resignations/${id}`, { status }, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          fetchResignations();
      } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6 mt-4">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Resignation Requests</h1>
                <p className="text-gray-500">Manage employee exit requests.</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)}><Plus className="w-4 h-4 mr-2" />Submit Resignation</Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="bg-gray-50 text-gray-700 uppercase">
                    <tr>
                        <th className="px-6 py-3">Employee</th>
                        <th className="px-6 py-3">Notice Date</th>
                        <th className="px-6 py-3">Last Working Day</th>
                        <th className="px-6 py-3">Reason</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {resignations.map(res => (
                        <tr key={res._id} className="border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{res.employeeId?.name || 'Unknown'}</td>
                            <td className="px-6 py-4">{new Date(res.noticeDate).toLocaleDateString()}</td>
                            <td className="px-6 py-4">{res.lastWorkingDay ? new Date(res.lastWorkingDay).toLocaleDateString() : '-'}</td>
                            <td className="px-6 py-4 truncate max-w-xs" title={res.reason}>{res.reason}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    res.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                    res.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>{res.status}</span>
                            </td>
                            <td className="px-6 py-4 flex gap-2">
                                {res.status === 'Pending' && (
                                    <>
                                        <button onClick={() => handleStatusChange(res._id, 'Approved')} className="text-green-600 hover:underline">Approve</button>
                                        <button onClick={() => handleStatusChange(res._id, 'Rejected')} className="text-red-600 hover:underline">Reject</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    {resignations.length === 0 && <tr><td colSpan={6} className="text-center py-6 text-gray-400">No resignation requests found.</td></tr>}
                </tbody>
            </table>
        </div>

        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 animate-in zoom-in-95">
                    <h2 className="text-xl font-bold mb-4">Submit Resignation</h2>
                    <form onSubmit={handleCreate} className="space-y-4">
                         {/* In real app, employeeId would be auto-filled or selected from list */}
                        <Input label="Employee ID (Ref)" value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})} placeholder="User Object ID" />
                        <Input label="Notice Date" type="date" value={formData.noticeDate} onChange={e => setFormData({...formData, noticeDate: e.target.value})} />
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                            <textarea 
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                                rows={4}
                                value={formData.reason}
                                onChange={e => setFormData({...formData, reason: e.target.value})}
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="submit">Submit Request</Button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
}
