import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Plus, Edit, Trash2, Tag, X, Monitor, Megaphone } from 'lucide-react';

interface Designation {
  _id: string;
  name: string;
  description: string;
  department: string;
}

interface Department {
    _id: string;
    name: string;
}

export default function DesignationList() {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDesig, setEditingDesig] = useState<Designation | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    department: ''
  });

  useEffect(() => {
    fetchDesignations();
    fetchDepartments();
  }, []);

  const fetchDesignations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/designations`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) {
        setDesignations(response.data.designations);
      }
    } catch (error) {
      console.error("Failed to fetch designations", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/departments`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.data.success) {
            setDepartments(response.data.departments);
        }
    } catch (error) {
        console.error("Failed to fetch departments", error);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      if (editingDesig) {
        await axios.put(`${import.meta.env.VITE_API_URL}/designations/${editingDesig._id}`, formData, { headers });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/designations/add`, formData, { headers });
      }
      
      setIsModalOpen(false);
      fetchDesignations();
      resetForm();
    } catch (error) {
      console.error("Failed to save designation", error);
      alert("Failed to save designation");
    }
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm("Are you sure?")) return;
    try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/designations/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchDesignations();
    } catch (error) {
        console.error("Failed to delete", error);
    }
  };

  const openCreateModal = () => {
      fetchDepartments(); // Fetch latest departments
      setEditingDesig(null);
      resetForm();
      setIsModalOpen(true);
  };

  const openEditModal = (desig: Designation) => {
      fetchDepartments(); // Fetch latest departments
      setEditingDesig(desig);
      setFormData({
          name: desig.name,
          description: desig.description,
          department: desig.department
      });
      setIsModalOpen(true);
  };

  const resetForm = () => {
      setFormData({ name: '', description: '', department: '' });
  };
  
  const getDepartmentIcon = (deptName: string) => {
    const lower = deptName?.toLowerCase() || '';
    if (lower.includes('it') || lower.includes('technology') || lower.includes('dev')) {
        return <Monitor className="w-6 h-6" />;
    }
    if (lower.includes('smm') || lower.includes('social') || lower.includes('marketing')) {
        return <Megaphone className="w-6 h-6" />;
    }
    return <Tag className="w-6 h-6" />;
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Designations</h1>
          <p className="text-sm text-gray-500">Manage employee roles and titles</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Add Designation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designations.map((desig) => (
              <Card key={desig._id} className="p-5 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                          {getDepartmentIcon(desig.department)}
                      </div>
                      <div className="flex gap-2">
                          <button onClick={() => openEditModal(desig)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-blue-600">
                              <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(desig._id)} className="p-2 hover:bg-red-50 rounded-full text-gray-500 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                          </button>
                      </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{desig.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{desig.description || 'No description'}</p>
                  
                  <div className="border-t pt-4">
                      <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Department:</span>
                          <span className="font-medium text-gray-900">{desig.department || '-'}</span>
                      </div>
                  </div>
              </Card>
          ))}
          {designations.length === 0 && !loading && (
              <div className="col-span-full py-10 text-center text-gray-500">
                  No designations found. Create one to get started.
              </div>
          )}
      </div>

       {/* Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-in zoom-in-95">
             <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingDesig ? 'Edit Designation' : 'Add New Designation'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <Input 
                label="Designation Name *" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
              <Input 
                label="Description" 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
               <Select 
                   label="Department"
                   options={[
                       {value: '', label: 'Select Department'},
                       ...departments.map(d => ({value: d.name, label: d.name}))
                   ]}
                   value={formData.department}
                   onChange={(value) => setFormData({...formData, department: value})}
               />

              
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingDesig ? 'Save Changes' : 'Create Designation'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
