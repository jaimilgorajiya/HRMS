import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Edit, Trash2, ArrowUpCircle } from 'lucide-react';

interface Grade {
  _id: string;
  name: string;
  basicSalaryRange: { min: number, max: number };
  benefits: string[];
  description: string;
}

export default function GradeList() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGrade, setCurrentGrade] = useState<Grade | null>(null);
  
  const [formData, setFormData] = useState({
      name: '',
      minSalary: 0,
      maxSalary: 0,
      benefits: '',
      description: ''
  });

  useEffect(() => {
      fetchGrades();
  }, []);

  const fetchGrades = async () => {
      try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/user-management/grades`);
          if (response.data.success) setGrades(response.data.grades);
      } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
          if (currentGrade) {
              await axios.put(`${import.meta.env.VITE_API_URL}/user-management/grades/${currentGrade._id}`, formData, { headers });
          } else {
              await axios.post(`${import.meta.env.VITE_API_URL}/user-management/grades`, formData, { headers });
          }
          setIsModalOpen(false);
          fetchGrades();
      } catch (err) { console.error(err); }
  };

  const openModal = (grade?: Grade) => {
      if (grade) {
          setCurrentGrade(grade);
          setFormData({ 
              name: grade.name, 
              minSalary: grade.basicSalaryRange?.min || 0,
              maxSalary: grade.basicSalaryRange?.max || 0,
              benefits: grade.benefits?.join(', ') || '',
              description: grade.description || ''
          });
      } else {
          setCurrentGrade(null);
          setFormData({ name: '', minSalary: 0, maxSalary: 0, benefits: '', description: '' });
      }
      setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 mt-4">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Employee Levels (Grades)</h1>
                <p className="text-gray-500">Manage salary bands and benefits for each level.</p>
            </div>
            <Button onClick={() => openModal()}><Plus className="w-4 h-4 mr-2" />Add Level</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
            {grades.map(grade => (
                <Card key={grade._id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                            <ArrowUpCircle className="w-6 h-6" />
                        </div>
                        <Button variant="outline" size="sm" onClick={() => openModal(grade)}>Edit</Button>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{grade.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">{grade.description}</p>
                    <div className="mt-4 pt-4 border-t text-sm">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-500">Salary Range</span>
                            <span className="font-mono font-medium">${grade.basicSalaryRange?.min} - ${grade.basicSalaryRange?.max}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {grade.benefits?.map((b, i) => (
                                <span key={i} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">{b}</span>
                            ))}
                        </div>
                    </div>
                </Card>
            ))}
        </div>

        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 animate-in zoom-in-95">
                    <h2 className="text-xl font-bold mb-4">{currentGrade ? 'Edit Grade' : 'Add Grade'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input label="Grade Name (e.g., L1, Manager)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Min Salary" type="number" value={formData.minSalary} onChange={e => setFormData({...formData, minSalary: Number(e.target.value)})} />
                            <Input label="Max Salary" type="number" value={formData.maxSalary} onChange={e => setFormData({...formData, maxSalary: Number(e.target.value)})} />
                        </div>
                        <Input label="Benefits (comma separated)" value={formData.benefits} onChange={e => setFormData({...formData, benefits: e.target.value})} placeholder="Health Insurance, Travel Allowance" />
                        <Input label="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                        
                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="submit">Save Level</Button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
}
