import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { User, Mail, Phone, MapPin } from 'lucide-react';

interface Manager {
  _id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  photo?: string;
  location?: string;
  status?: string;
}

export default function ManagerList() {
  const navigate = useNavigate();
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user-management/managers`, {
         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) setManagers(response.data.managers);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 mt-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Managers</h1>
        <p className="text-gray-500">List of all managers in the organization.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {managers.map(manager => (
            <Card 
                key={manager._id} 
                className="overflow-hidden hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/employees/view/${manager._id}`)}
            >
                <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <div className="px-6 relative">
                    <div className="absolute -top-12 left-6">
                        {manager.photo ? (
                            <img src={manager.photo} alt={manager.name} className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md" />
                        ) : (
                            <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-gray-500 shadow-md">
                                <User className="w-10 h-10" />
                            </div>
                        )}
                        <span className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white ${
                            manager.status === 'Active' ? 'bg-green-500' :
                            manager.status === 'Inactive' ? 'bg-red-500' : 'bg-gray-400'
                        }`} title={manager.status}></span>
                    </div>
                </div>
                <div className="pt-14 px-6 pb-6 space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{manager.name}</h3>
                                <p className="text-blue-600 font-medium">{manager.designation || 'Manager'}</p>
                                <p className="text-sm text-gray-500">{manager.department}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                manager.status === 'Active' ? 'bg-green-100 text-green-800' :
                                manager.status === 'Inactive' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                                {manager.status || 'Active'}
                            </span>
                        </div>
                    
                    <div className="space-y-2 pt-2 border-t text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{manager.email}</span>
                        </div>
                        {manager.phone && (
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span>{manager.phone}</span>
                            </div>
                        )}
                        {manager.location && (
                             <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span>{manager.location}</span>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        ))}
        {managers.length === 0 && !loading && (
            <div className="col-span-full text-center py-10 text-gray-500">No managers found.</div>
        )}
      </div>
    </div>
  );
}
