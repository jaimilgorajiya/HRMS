import authenticatedFetch from '../utils/apiHandler';
import API_URL from '../config/api';
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, Search, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';
import SearchableSelect from '../components/SearchableSelect';

const EarningDeductionType = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        type: 'Earnings',
        allowanceType: 'None',
        description: ''
    });

    
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await authenticatedFetch(`${API_URL}/api/earning-deduction-types`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const resData = await response.json();
            if (resData.success) {
                setData(resData.earningDeductionTypes);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isEditing ? `${API_URL}/api/earning-deduction-types/${currentId}` : `${API_URL}/api/earning-deduction-types/add`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await authenticatedFetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const resData = await response.json();
            if (resData.success) {
                Swal.fire({
                    title: 'Success!',
                    text: isEditing ? 'Updated successfully' : 'Added successfully',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                setIsModalOpen(false);
                resetForm();
                fetchData();
            } else {
                Swal.fire('Error', resData.error || 'Something went wrong', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to save data', 'error');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            type: 'Earnings',
            allowanceType: 'None',
            description: ''
        });
        setIsEditing(false);
        setCurrentId(null);
    };

    const handleEdit = (item) => {
        setFormData({
            name: item.name,
            type: item.type,
            allowanceType: item.allowanceType || 'None',
            description: item.description || ''
        });
        setCurrentId(item._id);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await authenticatedFetch(`${API_URL}/api/earning-deduction-types/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const resData = await response.json();
                if (resData.success) {
                    Swal.fire('Deleted!', 'Item has been deleted.', 'success');
                    fetchData();
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to delete item', 'error');
            }
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const isActive = currentStatus === 'Active';
        const result = await Swal.fire({
            title: isActive ? 'Deactivate?' : 'Activate?',
            text: `Are you sure you want to ${isActive ? 'deactivate' : 'activate'} this?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2563EB',
            cancelButtonColor: '#64748B',
            confirmButtonText: `Yes, ${isActive ? 'deactivate' : 'activate'} it!`
        });

        if (result.isConfirmed) {
            try {
                const response = await authenticatedFetch(`${API_URL}/api/earning-deduction-types/status/${id}`, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const resData = await response.json();
                if (resData.success) {
                    Swal.fire({
                        title: 'Success!',
                        text: `Status updated successfully.`,
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    fetchData();
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to update status', 'error');
            }
        }
    };

    const earnings = data.filter(item => item.type === 'Earnings');
    const deductions = data.filter(item => item.type === 'Deductions');

    const renderTable = (items, title) => (
        <div style={{ flex: 1, minWidth: '450px', background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', background: '#fcfcfc' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#475569' }}>{title}</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#F8FAFC' }}>
                            <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: '600', fontSize: '12px', borderBottom: '1.5px solid #E2E8F0', width: '60px' }}>Sr. No</th>
                            <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: '600', fontSize: '12px', borderBottom: '1.5px solid #E2E8F0' }}>{title.includes('Earning') ? 'Earning Name' : 'Deduction Name'}</th>
                            <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: '600', fontSize: '12px', borderBottom: '1.5px solid #E2E8F0', width: '100px', textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#64748B' }}>Loading...</td></tr>
                        ) : items.length > 0 ? items.map((item, index) => (
                            <tr key={item._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                <td style={{ padding: '12px 16px', color: '#1E293B', fontSize: '13px' }}>{index + 1}</td>
                                <td style={{ padding: '12px 16px', color: '#3B82F6', fontSize: '13px', fontWeight: '500' }}>{item.name}</td>
                                <td style={{ padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <button 
                                            onClick={() => toggleStatus(item._id, item.status)}
                                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                                        >
                                            {item.status === 'Active' ? <ToggleRight size={24} color="#22C55E" /> : <ToggleLeft size={24} color="#94A3B8" />}
                                        </button>
                                        <button 
                                            onClick={() => handleEdit(item)}
                                            className="btn-action-edit"
                                            style={{ padding: '5px', width: '28px', height: '28px' }}
                                            title="Edit"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item._id)}
                                            className="btn-action-delete"
                                            style={{ padding: '5px', width: '28px', height: '28px' }}
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#64748B' }}>No {title.toLowerCase()} found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '0px', width: '100%', minHeight: '100vh', background: '#F4F7FE' }}>
            <div style={{ padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#1E293B', margin: 0 }}>Earning Deduction Type</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        style={{ background: '#3B648B', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600' }}
                    >
                        <Plus size={14} /> ADD
                    </button>
                </div>
            </div>

            <div style={{ padding: '0 30px 40px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {renderTable(earnings, "Earning List")}
                {renderTable(deductions, "Deduction List")}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: '8px', width: '500px', maxWidth: '95%', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                        <div style={{ background: 'linear-gradient(90deg, #3B648B 0%, #4facfe 100%)', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#fff' }}>Earning Deduction Type</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Earning Deduction name <span style={{ color: '#EF4444' }}>*</span></label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter name"
                                        required 
                                        style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E2E8F0', borderRadius: '6px', outline: 'none', fontSize: '13px' }}
                                    />
                                </div>

                                <SearchableSelect 
                                    label="Earning Deduction Type"
                                    required={true}
                                    options={[
                                        { label: 'Earnings', value: 'Earnings' },
                                        { label: 'Deductions', value: 'Deductions' }
                                    ]}
                                    value={formData.type}
                                    onChange={(val) => setFormData({ ...formData, type: val })}
                                />

                                {formData.type === 'Earnings' && (
                                    <SearchableSelect 
                                        label="Allowance Type"
                                        required={true}
                                        options={[
                                            { label: 'None', value: 'None' },
                                            { label: 'Bonus Allowance', value: 'Bonus Allowance' },
                                            { label: 'Special Allowance', value: 'Special Allowance' },
                                            { label: 'Transport Allowance', value: 'Transport Allowance' },
                                            { label: 'Other', value: 'Other' }
                                        ]}
                                        value={formData.allowanceType}
                                        onChange={(val) => setFormData({ ...formData, allowanceType: val })}
                                        searchable={true}
                                    />
                                )}

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Description</label>
                                    <textarea 
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Enter description"
                                        style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E2E8F0', borderRadius: '6px', outline: 'none', height: '80px', resize: 'none', fontSize: '13px' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                                <button 
                                    type="submit"
                                    style={{ background: '#3B648B', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}
                                >
                                    <Check size={16} /> {isEditing ? 'UPDATE' : 'ADD'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EarningDeductionType;
