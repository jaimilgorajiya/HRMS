import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Edit, Trash2, Shield, X, Check } from 'lucide-react';

interface Role {
  _id: string;
  name: string;
  permissions: string[];
  description: string;
}

const AVAILABLE_PERMISSIONS = [
    'view_employees', 'manage_employees',
    'view_payroll', 'manage_payroll',
    'view_attendance', 'manage_attendance',
    'manage_roles', 'view_reports'
];

export default function RoleList() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    permissions: [] as string[],
    description: ''
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user-management/roles`, {
         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) setRoles(response.data.roles);
    } catch (err) { console.error(err); }
  };

  const handlePermChange = (perm: string) => {
      setFormData(prev => {
          const newPerms = prev.permissions.includes(perm)
              ? prev.permissions.filter(p => p !== perm)
              : [...prev.permissions, perm];
          return { ...prev, permissions: newPerms };
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
          if (currentRole) {
              await axios.put(`${import.meta.env.VITE_API_URL}/user-management/roles/${currentRole._id}`, formData, { headers });
          } else {
              await axios.post(`${import.meta.env.VITE_API_URL}/user-management/roles`, formData, { headers });
          }
          setIsModalOpen(false);
          fetchRoles();
      } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
      if(!confirm("Delete this role?")) return;
      try {
           await axios.delete(`${import.meta.env.VITE_API_URL}/user-management/roles/${id}`, {
               headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
           });
           fetchRoles();
      } catch (err) { console.error(err); }
  };

  const openModal = (role?: Role) => {
      if (role) {
          setCurrentRole(role);
          setFormData({ name: role.name, permissions: role.permissions || [], description: role.description || '' });
      } else {
          setCurrentRole(null);
          setFormData({ name: '', permissions: [], description: '' });
      }
      setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Management Roles</h1>
           <p className="text-gray-500">Define roles and access permissions.</p>
        </div>
        <Button onClick={() => openModal()}><Plus className="w-4 h-4 mr-2" />Add Role</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         {roles.map(role => (
             <Card key={role._id} className="p-5">
                 <div className="flex justify-between items-start mb-4">
                     <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                         <Shield className="w-6 h-6" />
                     </div>
                     <div className="flex gap-2">
                         <button onClick={() => openModal(role)} className="p-2 text-gray-400 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                         <button onClick={() => handleDelete(role._id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                     </div>
                 </div>
                 <h3 className="text-lg font-bold mb-2">{role.name}</h3>
                 <div className="flex flex-wrap gap-2">
                     {(role.permissions || []).slice(0, 5).map(p => (
                         <span key={p} className="px-2 py-1 bg-gray-100 text-xs rounded-full">{p.replace('_', ' ')}</span>
                     ))}
                     {(role.permissions?.length || 0) > 5 && <span className="text-xs text-gray-500">+{role.permissions.length - 5} more</span>}
                 </div>
             </Card>
         ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
           <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 animate-in zoom-in-95">
               <div className="flex justify-between mb-4">
                   <h2 className="text-xl font-bold">{currentRole ? 'Edit Role' : 'New Role'}</h2>
                   <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5" /></button>
               </div>
               <form onSubmit={handleSubmit} className="space-y-4">
                   <Input label="Role Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                   
                   <div>
                       <label className="text-sm font-medium mb-2 block">Permissions</label>
                       <div className="grid grid-cols-2 gap-2">
                           {AVAILABLE_PERMISSIONS.map(perm => (
                               <div key={perm} 
                                    onClick={() => handlePermChange(perm)}
                                    className={`p-2 border rounded cursor-pointer text-sm flex items-center gap-2 ${formData.permissions.includes(perm) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    {formData.permissions.includes(perm) && <Check className="w-3 h-3" />}
                                    {perm.replace(/_/g, ' ')}
                               </div>
                           ))}
                       </div>
                   </div>

                   <div className="flex justify-end gap-3 pt-4">
                       <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                       <Button type="submit">Save Role</Button>
                   </div>
               </form>
           </div>
        </div>
      )}
    </div>
  );
}
